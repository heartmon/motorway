<?php
include_once('../_db.php');

$lat = $_GET['lat'];
$long = $_GET['longitude'];
$lane = $_GET['lane'];


//$sql = "SELECT *, max(subdistance), min(subdistance) FROM roughness where section LIKE '%F1' ORDER BY the_geom <-> ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') LIMIT 80";

// $sql = "SELECT max(subdistance), min(subdistance) FROM (
// SELECT * FROM roughness where section LIKE '%F1' 

// ORDER BY the_geom <-> ST_GeometryFromText('SRID=4326;POINT(' || $long || ' ' || $lat || ')')
// LIMIT 80) as foo";

// $r = retrieve($sql);
// $max = $r['max'];
// $min = $r['min'];

// '0101000020E6100000284F0FC0BC2B5940608033E7CFC12B40''

$sql = "SELECT rn.section, rn.distance, rn.subdistance, rn.iri_avg , rn.lat, rn.long , rn.code,  rt.rut_lane, t.mpd , rn.the_geom
				FROM (roughness rn LEFT JOIN rutting rt on rn.subdistance = rt.subdistance and rn.section = rt.section)
						LEFT JOIN texture t on  rt.subdistance = t.subdistance and rt.section     = t.section 
				WHERE  
				 rn.section LIKE '%{$lane}' ORDER BY rn.the_geom <-> ST_GeometryFromText('SRID=4326;POINT(' || $long || ' ' || $lat || ')') LIMIT 80 ";



$zoom = "SELECT ST_AsText(ST_Envelope(ST_Collect(the_geom))) as geo ".
			"FROM ({$sql}) as a GROUP BY section";
		//echo $zoom;
		$result = retrieve($zoom);
		//print_r($result);
$a = array();
$rows = retrieve($sql);
// $result = pg_query($sql);
// $rows = array();
// $num_rows = pg_num_rows($result);
// 	if($num_rows)
// 		{
// 			$c = 0;
// 			while($row = pg_fetch_assoc($result)) {
// 				$row['hdm4result'] = null;
// 				$rows[] = $row;
// 		}
// 		$rows['usedlength'] = 80;
// 	}
// 	else
// 	{
// 		$rows['error'] = 'ไม่อยู่ในตำแหน่ง';
// 	}
if(sizeof($rows) > 0)
{
	$rows['usedlength'] = 80;
	$a[] = $result;
	$a[] = $rows;
}
else
{
	$rows['error'] = 'ไม่อยู่ในตำแหน่ง';
}

echo $_GET['callback'].'('.json_encode($a).')';
	


?>