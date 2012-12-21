<?php
include_once('../_db.php');

//Get value
//$expressway = $_GET['expressway'];
$kmstart = $_GET['kmstart'];
$kmend = $_GET['kmend'];
$infotype = $_GET['infotype'];
$kmfreq = $_GET['kmfreq'];
$section = $_GET['section'];
$exptype = $_GET['exptype'];

$userkmstart = $kmstart;
$userkmend = $kmend;



//Select Column Name for each infotype
if($infotype == 'roughness')
	$column_info_name = 'iri_avg';
elseif($infotype == 'rutting')
	$column_info_name = 'rut_lane';
elseif($infotype == 'texture')
	$column_info_name = 'mpd';


//Select first section
if($exptype == 1 && strrpos($section, "0000") !== false)
{
	$e = substr($section,0,2).'%M00%';
	$lane = substr($section,-2);
	//$sql = "SELECT section from {$infotype} where section LIKE '{$e}' AND subdistance >= {$kmstart} AND type = '{$exptype}' order by section limit 1";
	$sql = "SELECT section from {$infotype} where section LIKE '{$e}' AND type = '{$exptype}' 
	AND (section NOT LIKE '%0102%' AND section NOT LIKE '%0302%') order by (subdistance-{$kmstart})^2, section limit 1";

	$result = pg_query($sql);
	$s = pg_fetch_assoc($result);
	//echo $sql;
	//print_r($s);
	//echo $s[0]['section'];
	$prefix = substr($s['section'],0,9);
	$section = $prefix.$lane;

}


//Get HDM4 value
$year = $_GET['year'];
$type = $_GET['hdm4type'];
if($type == "unlimited")
	$typetable = "hdm4_unlimited";
elseif($type == "limited_half")
	$typetable = "hdm4_limited_half";
else
	$typetable = "hdm4_limited_full";


//Extract value for hdm4 (dir lane )
if($exptype == "1")
{
	$hdm4section = $section;
	$dir = substr($section,-2,1);
	$laneno = substr($section,-1);
	//Extract dir and lane
	if($dir == 'R')
		$dir = 'ฝั่งขาเข้า';
	else
		$dir = 'ฝั่งขาออก';
	$lane = "ช่องจราจร";
	switch($laneno){
		case '1': $lane .= 'ขวา'; break;
		case '2': $lane .= 'กลาง(1)'; break;		
		case '3': $lane .= 'กลาง(2)'; break;
		case '4': $lane .= 'ซ้าย'; break;
	}
}
else
{
	//$hdm4section = substr($section,0,-3);
	$hdm4section = $section;
	$dir = '-';
	$lane = '-';
}

$GLOBALS["lasthdm4kmend"] = 0;
/*echo $typetable;
echo $hdm4abbexp;
echo $dir;
echo $lane;*/


// if(!$kmend)// || (!$kmstart))
// {
// 	$findkm = true;
 	$cond = " WHERE section LIKE '{$section}'";

// 	if($kmstart)
// 		$cond .= " AND subdistance >= {$kmstart}";
// 	if($kmend)
// 	{	
// 		$kmendpadding = $kmend+1;
// 		$cond .= " AND subdistance <= {$kmendpadding}";
// 	}
	//MAX-MIN calculation
	$sql = "SELECT MIN(subdistance), MAX(subdistance) FROM {$infotype}".$cond;

	$result = pg_query($sql);
	$row = pg_fetch_assoc($result);
	$max = $row['max'];
	$min = $row['min'];

	if($kmstart < $min || !$kmstart)
		$kmstart = $min;
	if($kmend > $max || !$kmend)
		$kmend = $max;

// // }
$dist = $kmstart - $min;
$rangefix = 25;

//if($max != null || $min != null || !$findkm)
//{

		$sql = "SELECT rn.section, rn.distance, rn.subdistance, rn.iri_avg , rn.lat, rn.long , rn.code,  rt.rut_lane, t.mpd 
				FROM (roughness rn LEFT JOIN rutting rt on rn.subdistance = rt.subdistance and rn.section = rt.section)
						LEFT JOIN texture t on  rt.subdistance = t.subdistance and rt.section     = t.section 
				WHERE   ";
		
		// if(strrpos($section, '01b') !== false)
		// {
		// 	$suffix = substr($section,-3);
		// 	$sect_cond = " (rn.section LIKE '0101%".$suffix."' OR rn.section LIKE '0102%".$suffix."')";
		// }
		// else
			$sect_cond = " rn.section LIKE '{$section}'";

		//$sect_cond .= " AND rn.section NOT LIKE '%0102M00%' AND rn.section NOT LIKE '%0302M00%'";
		$sql .= $sect_cond;

		$sql .= " AND rn.type = '{$exptype}'";

		//Determine frequency
		//$subdistance = $kmend - $kmstart;
		//if($subdistance <= 10)
			$rangefix = 25;
		//else if($subdistance > 2 && $subdistance <= 4)
		//{
		// 	$rangefix = 50;
		// }
		// else
		// {
		// 	$rangefix = 500;
		// }
		if(!$kmfreq)
			$kmfreq = $rangefix;

	//Define offset for expanding the kmend range (Ex.search 13-14 with freq.=10, it has to include 14.012 for 13.992-14.012 range)
//	$kmendpadding = $kmend;
	//if($kmfreq != 5)
	$kmendpadding = $kmend+1;

	$sql .= " AND rn.subdistance >= {$kmstart} AND rn.subdistance <= {$kmendpadding}";
	$sql .= " ORDER BY subdistance ,section";
	//echo $sql;
	
	$result = pg_query($sql);
	$rows = array();
	$max_distance = 0;
	if ($result !== false) {
		$num_rows = pg_num_rows($result);
		//echo $num_rows;
		if($num_rows)
		{
			$c = 0;
			while($row = pg_fetch_assoc($result)) {
			//if(!(strrpos($section, '0101%') !== false && ($row['subdistance'] > 7.6 )))
			//	{
					$section = $row['section'];
					if($row['subdistance'] <= $GLOBALS['kmend'])
						$rows['indexsearch'] = $c;
					//Add HDM4 Result
					//echo $GLOBALS["lasthdm4kmend"];
					if($GLOBALS["lasthdm4kmend"] <= $row['subdistance'])
						$hdm4result = hdm4join($typetable, $hdm4section, $dir, $lane,$row['subdistance']);
					////if($GLOBALS["lasthdm4kmend"] <= $row['subdistance']-19.5 && (strrpos($section, '0103100') !== false))
						//$hdm4result = hdm4join($typetable, $hdm4abbexp, $dir, $lane,$row['subdistance']);
					$row['hdm4result'] = $hdm4result;				
					//new
					//if(strrpos($section, '0101100') !== false || strrpos($section, '0102100') !== false || strrpos($section, '0103100') !== false)
					//	$row['subdistance'] = round($row['subdistance'],3)  - round($maxFromFirstSection,3);

					$rows[] = $row;
					if($max_distance < $row['subdistance'])
						$max_distance = $row['subdistance'];
					
					$c++;
			// 	}
			// else
			// 	{
			// 		break;
			// 	}
			}

			$rows['num_rows'] = $num_rows;
			$rows['rangefix'] = $rangefix;
			$rows['lastkm'] = $max_distance;
			$rows['dist_image'] = $dist;
			//$rows['specialcase'] = $maxFromFirstSection;
		}
		else
		{
			$type = exptypeToFull($exptype);
			
			$rows['error'] = "ระบบไม่ค้นพบข้อมูล: \nประเภทสายทาง: ".$type." \nตอนควบคุม: ".$section." \nความเสียหาย: ".$infotype."\nช่วงกม.: ".$userkmstart." - ".$userkmend;
			if($kmend < $kmstart)
				$rows['error'] .= " (ช่วงกม. ต้องไม่เกิน ".$kmend.")";
		}
	}

	/*else {
		echo "Problem with query " . $query . "<br/>"; 
	    echo pg_last_error(); 
		pg_close($dbh);
	}*/
//}
else
{
	$type = exptypeToFull($exptype);
	$rows['error'] = "ระบบไม่ค้นพบข้อมูล \nประเภทสายทาง: ".$type." \nตอนควบคุม: ".$section." \nความเสียหาย: ".$infotype;
}

echo $_GET['callback'].'('.json_encode($rows).')';

function exptypeToFull($exptype)
{
	switch($exptype)
	{
		case 1: $type = "ทางหลัก" ; break; 
		case 2: $type = "ทางขึ้นลง" ; break;
		case 3: $type = "ทางเชื่อม" ; break;
	}
	return $type;
}

function hdm4join($typetable, $hdm4section, $dir, $lane, $kms){
	//year = {$year} AND
	// if($hdm4abbexp == "0103")
	// {
	// 	$kms = $kms-19.5;
	// }
	$hdm4sql = "SELECT year,workdes,cost,kmend from {$typetable} 
			WHERE 	section LIKE '{$hdm4section}' AND 
					dir = '{$dir}' AND 
					lane = '{$lane}' AND
					{$kms} >= kmstart AND {$kms} < kmend
			ORDER BY id";
	//echo $hdm4sql;
	//echo $hdm4sql;
	$sqlresult = pg_query($hdm4sql);
	$hdm4result = array();
	if(pg_num_rows($sqlresult))
	{
		while($row = pg_fetch_assoc($sqlresult)) {
			$hdm4result[] = $row;
			$GLOBALS["lasthdm4kmend"] = $row['kmend'];
		}
	}
	else
	{
		$hdm4result[] = 'ไม่มีแผนการซ่อมบำรุง';
	}
	return $hdm4result;
}
?>
