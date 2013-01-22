<?php
include("../_db.php");
include("_opz.php");
ini_set('display_errors', '1');
//$dbh = connect();
$d = "hdm4"; // *
$tbl = "hdm4_limited_full"; // **
$hdm4_cols = "(abb_exp,dir,lane,kmstart,kmend,year,workdes,npv,cost,section)";
//$csv_img = "C:/Program Files (x86)/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/run_db/";
$csv_img = "/home/asset/public_html/motorway/run_db/";

	$fp = "csv_hdm4_full/";
	$fs = d2a($fp,true);
	foreach($fs as $k => $v) {
		$q = "COPY " . $tbl . " " 
		. $hdm4_cols . // ***
		" FROM '" . $csv_img . $v . "' WITH DELIMITER ',' CSV HEADER";
		echo "+++ " . $q . "<br/>";
		retrieve($q);
		echo "<br/>";		
	}


	
	$q = "update {$tbl} set expressway = substring(section from 0 for 3) where expressway is null";
	retrieve($q);
	$q = "update {$tbl} set type = '1' where type is null";
	retrieve($q);
	$q = "update {$tbl} set section = substring(section from 0 for 12)";
	retrieve($q);
	//$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
	//retrieve($q);



?>
