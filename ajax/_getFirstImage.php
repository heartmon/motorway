<?php
include_once('../_db.php');
$section = $_GET['section'];

$sql = "select *  from images where section LIKE '{$section}'";
$rows = retrieve($sql);

if($rows == null)
	$rows['error'] = "ไม่สามารถดึงข้อมูล image จากฐานข้อมูลได้\n"."ตอนควบคุม: ".$section;


echo $_GET['callback'].'('.json_encode($rows).')';

?>