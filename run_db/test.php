<!DOCTYPE HTML>
<html>
<head>
	<!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<?php
include("../_db.php");
include("_opz.php");
ini_set('display_errors', '1');
//$dbh = connect();
$d = "hdm4"; // *
$tbl = "hdm4_unlimited"; // **

	
	$q = "select * from {$tbl} limit 30";
	$a = retrieve($q);

	print_r($a);
	//$q = "update {$tbl} set type = '1' where type is null";
	//retrieve($q);
	//$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
	//retrieve($q);



?>
