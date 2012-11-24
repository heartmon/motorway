<?php
include("../_db.php");
include("_opz.php");
//ini_set('display_errors', '1');

//$dbh = connect();
$d = "iri"; // *
$tbl = "pavement_copy"; // **
//$iri_cols = "(section,distance,subdistance,iri_right,iri_left,iri_avg,speed,events,lat,long)";
$pavement_cop_cols = "(no,framekey,link_id,distance,sta,lane,surveydate,lat,long,ratedate,rators,cracks_aca,cracks_acw,cracks_act,bleeding,raveling,phole,deformation,patching,joint)";
//$csv_img = "C:/Program Files (x86)/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/run_db/";
$csv_img = "/Applications/MAMP/htdocs/motorway2/run_db/";
	//$c = 0;
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('csv_pavement')); 
 	 foreach($files as $file) { 
     	//echo $file . "<br/>";
     	$section = substr($file,15,11);
     	//echo $section . "<br/>";
     	//$c++;
     	//echo $v . "<br/>";
		$q = "COPY " . $tbl . " " 
		. $pavement_cop_cols . // ***
		" FROM '" . $csv_img . $file . "' WITH DELIMITER ',' CSV HEADER";
		echo "+++ " . $q . "<br/>";
		retrieve($q);
		echo "<br/	>";	

		$q = "update {$tbl} set section = '{$section}' where section is null";
		retrieve($q);
	}


	// $qc = "INSERT INTO pavement (distance,lat,long,crack_aca,crack_act,bleeding,raveling,phole,deformation,pacthing,id,section,the_geom) 
	// (SELECT distance,lat,long,cracks_aca,cracks_act,bleeding,raveling,phole,deformation,patching from pavement_copy
	//  where cracks_aca <> 0 and cracks_act <> 0 and bleeding <> 0 and raveling <> 0 and phole <> 0 and deformation <> 0 
	//  and patching <> 0 order by id)";
 //    retrieve($qc);
	//echo $c;	


	// $fp = "csv_iri/";
	// $fs = d2a($fp,true);
	// foreach($fs as $k => $v) {
	// 	echo $v . "<br/>";
	//	$q = "COPY " . $tbl . " " 
	//	. $iri_cols . // ***
	//	" FROM '" . $csv_img . $v . "' WITH DELIMITER ',' CSV HEADER";
	//	echo "+++ " . $q . "<br/>";
	//	retrieve($q);
	//	echo "<br/	>";		
	//}
	
	//$q = "update {$tbl} set mark = 'start' where subdistance = 0";
	//retrieve($q);
	//$q = "update {$tbl} set type = '1' where type is null";
	//retrieve($q);
	//$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
	//retrieve($q);



?>
