<?php
include_once('../_db.php');

//Get value
//$expressway = $_GET['expressway'];
$section = $_GET['section'];

$sql = "SELECT * FROM pavement where section LIKE '{$section}%'";
//echo $sql;
$rows = retrieve($sql);

if($rows != null)
{

}
else
{
	$rows['error'] = 'ไม่พบข้อมูลประเภท Pavement ของ Section: '.$section.' ได้';
}

echo $_GET['callback'].'('.json_encode($rows).')';

?>