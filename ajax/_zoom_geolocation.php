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
		if(isset($_GET['exptype'])) {
			$q .= "AND type = '{$exptype}' ";
		}
		if(isset($kmstart) and $kmstart !='') {
			$q .= "AND subdistance >= {$kmstart} ";
		} else {
			//$q .= "AND subdistance >= 0 ";
		}
		if(isset($kmend) and $kmend !='') {
			$q .= "AND subdistance <= {$kmend} ";
		} else {
			//$q .= "AND subdistance <= 10 ";
		}
		$q .= "GROUP BY section";
		//echo $q;
		$result = retrieve($q);
		//print_r($result);
		//$result = pg_query($q);
		//$row = pg_fetch_assoc($result);
		echo $_GET['callback'].'('.json_encode($result).')';
		
				
	}			
?>
