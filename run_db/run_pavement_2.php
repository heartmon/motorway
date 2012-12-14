<?php
include("../_db.php");
include("_opz.php");
//ini_set('display_errors', '1');

//$dbh = connect();
$d = "iri"; // *
$tbl = "pavement"; // **
//$iri_cols = "(section,distance,subdistance,iri_right,iri_left,iri_avg,speed,events,lat,long)";
$pavement_cop_cols = "(no,framekey,link_id,distance,sta,lane,surveydate,lat,long,ratedate,rators,cracks_aca,cracks_acw,cracks_act,bleeding,raveling,phole,deformation,patching,joint)";
//$csv_img = "C:/Program Files (x86)/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/run_db/";
$csv_img = "/Applications/MAMP/htdocs/motorway/run_db/";
	//$c = 0;
 //    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('csv_pavement')); 
 // 	 foreach($files as $file) { 
 //     	//echo $file . "<br/>";
 //     	$section = substr($file,15,11);
 //     	//echo $section . "<br/>";
 //     	//$c++;
 //     	//echo $v . "<br/>";
	// 	$q = "COPY " . $tbl . " " 
	// 	. $pavement_cop_cols . // ***
	// 	" FROM '" . $csv_img . $file . "' WITH DELIMITER ',' CSV HEADER";
	// 	echo "+++ " . $q . "<br/>";
	// 	retrieve($q);
	// 	echo "<br/	>";	
	// }


	$qc = "INSERT INTO pavement (sta,lat,long,crack_aca,crack_act,bleeding,raveling,phole,deformation,pacthing,section) 
	(SELECT sta,lat,long,cracks_aca,cracks_act,bleeding,raveling,phole,deformation,patching,link_id from pavement_copy
	 where cracks_aca <> 0 or cracks_act <> 0 or bleeding <> 0 or raveling <> 0 or phole <> 0 or deformation <> 0 
	 or patching <> 0 order by id)";
	echo $qc;
    retrieve($qc);
	//echo $c;	

    
	$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
	retrieve($q);
	$q = "update pavement 
set deformation = 0
where deformation is NULL";
retrieve($q);
$q = "update pavement 
set pacthing = 0
where pacthing is NULL";
retrieve($q);
$q = "update pavement 
set phole = 0
where phole is NULL";
retrieve($q);
$q = "update pavement 
set bleeding = 0
where bleeding is NULL";
retrieve($q);
$q = "update pavement 
set crack_aca = 0
where crack_aca is NULL";
retrieve($q);
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
	
	



?>
