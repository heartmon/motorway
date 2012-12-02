<?php
include("../_db.php");
include("_opz.php");
ini_set('display_errors', '1');
//$dbh = connect();
$d = "images"; // *
$tbl = "images"; // **
$imgcp_cols =  '("section","frameno","interlat","interlong","interalt","framenocal","subdis","measure","ref","lat","long","gps_po","filename")';
$img_cols = '("section","frameno","lat","long","filename","gid","the_geom","dummycol","code")';
//$csv_img = "C:/Program Files (x86)/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/run_db/";
$csv_img = "C:/WAPP/apache2/htdocs/ddd/run_db/";

if($tbl == "images") {
	//Get All Distinct Section
	$sql = 'select distinct section from images_copy order by section';
	$sections = retrieve($sql);
	
	for($i=0;$i<sizeof($sections)-1;$i++)
	{
		$section = $sections[$i]['section'];
		
		//Select the first distance [roughness is a reference]
		if(strrpos($section,'R') !== false)
			$sql = "select *  from roughness where section LIKE '{$section}' order by subdistance DESC limit 1";	
		else
			$sql = "select *  from roughness where section LIKE '{$section}' order by subdistance limit 1";
		$row = retrieve($sql);
		$latstart = $row[0]['lat'];
		$longstart = $row[0]['long'];

		//Select the last
		//xxxxxxxxx

		$qc = "INSERT INTO images (section,frameno,lat,long,filename,the_geom) 
	(SELECT section,frameno,lat,long,filename,the_geom from images_copy where section LIKE '{$section}' order by (lat-{$latstart})^2 + (long-{$longstart})^2 limit 1)";
    retrieve($qc);

		echo $qc;

		$q = "update {$tbl} set the_geom = ST_GeometryFromText('SRID=4326;POINT(' || long || ' ' || lat || ')') where the_geom is null";
		retrieve($q);
	}

	
}


?>

