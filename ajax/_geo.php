<?php
	include_once('../_db.php');
	if ($dbh === null) {
		//Error
	} else {
		$expressway = $_GET['expressway'];
		$searchtype = $_GET['searchtype'];
		$infotype = $_GET['infotype'];
		$exptype = $_GET['exptype'];
		$kmstart = $_GET['kmstart'];
		$kmend = $_GET['kmend'];
		$section = $_GET['section'];
		
		$q = "SELECT ST_AsText(ST_Envelope(ST_Collect(the_geom))) as geo ".
			"FROM {$infotype} WHERE ST_IsEmpty(the_geom) is false ";
		$q .= "AND section LIKE '{$section}' ";
		if(isset($_GET['exptype']) and $infotype != "pavement") {
			$q .= "AND type = '{$exptype}' ";
		}
		if(isset($kmstart) and $kmstart !='' and $infotype != "pavement") {
			$q .= "AND subdistance >= {$kmstart} ";
		} 
		if(isset($kmend) and $kmend !='' and $infotype != "pavement") {
			$q .= "AND subdistance <= {$kmend} ";
		}
		$q .= "GROUP BY section";
		//echo $q;
		$result = retrieve($q);
		echo $_GET['callback'].'('.json_encode($result).')';
						
	}			
?>
