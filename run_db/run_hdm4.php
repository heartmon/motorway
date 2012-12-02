<?php
include("../_db.php");
include("_opz.php");
ini_set('display_errors', '1');
//$dbh = connect();
$d = "hdm4"; // *
$tbl = "hdm4_unlimited"; // **
$hdm4_cols = "(abb_exp,dir,lane,kmstart,kmend,year,workdes,npv,cost)";
//$csv_img = "C:/Program Files (x86)/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/run_db/";
$csv_img = "/Applications/MAMP/htdocs/motorway/run_db/";

	$fp = "csv_hdm4/";
	$fs = d2a($fp,true);
	foreach($fs as $k => $v) {
		$q = "COPY " . $tbl . " " 
		. $hdm4_cols . // ***
		" FROM '" . $csv_img . $v . "' WITH DELIMITER ',' CSV HEADER";
		echo "+++ " . $q . "<br/>";
		retrieve($q);
		echo "<br/>";		
	}
	
	$q = "update {$tbl} set expressway = '07' where expressway is null";
	retrieve($q);
	$q = "update {$tbl} set type = '1' where type is null";
	retrieve($q);
	//$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
	//retrieve($q);



?>
