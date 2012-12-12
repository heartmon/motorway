<!DOCTYPE HTML>
<html>
<head>
	<!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="css/bootstrap/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link rel="stylesheet" type="text/css" href="css/tablesorter/style.css">	
	<link rel="stylesheet" href="js/jquery/fancybox/fancybox/jquery.fancybox-1.3.4.css" type="text/css" media="screen" />
	<!--[if IE]>
		<link rel="stylesheet" type="text/css" href="css/bootstrap/css/ie_bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/ie_style.css">
		<script type="text/javascript" src="js/indexOf_forIE.js"></script>
	<![endif]-->
	<!--[if lte IE 7]>
	<link rel="stylesheet" type="text/css" href="css/ie7.css">
	<![endif]-->

	<!--<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>-->
	<script type="text/javascript" src="js/jquery/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="css/bootstrap/js/bootstrap.js"></script>
	<script type="text/javascript" src="js/jquery/jquery-ui.js"></script>
	<!--[if lte IE 8]>
		<script type="text/javascript" src="js/flashcanvas/flashcanvas.js"></script>
		<script type="text/javascript" src="js/flashcanvas/canvas2png.js"></script>
	<![endif]-->
	<script type="text/javascript" src="js/flot/jquery.flot.min.js"></script>
	<script type="text/javascript" src="js/flot/jquery.flot.legendoncanvas.js"></script>
	<script type="text/javascript" src="js/flot/jquery.flot.threshold-ab.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.tablescroll.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.tablesorter.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.tablesorter.pager.js"></script>
	<script type="text/javascript" src="js/jquery/fancybox/fancybox/jquery.fancybox-1.3.4.pack.js"></script>
	<script type="text/javascript" src="js/openlayer/googlemap.js"></script>
	<!--<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>-->
	<script type="text/javascript" src="js/openlayer/OpenLayers.js"></script>
	<script defer="defer" type="text/javascript" src="js/gis.js"></script>

	<script type="text/javascript" src="js/controller.js"></script>
	<script type="text/javascript" src="js/view.js"></script>
	<script type="text/javascript" src="js/model.js"></script>
	
<script type="text/javascript" src="js/script.js"></script>
	<script type="text/javascript" src="js/jquery/jsmovie.1.4.3b.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.reel.js"></script>

	<script type="text/javascript" src="js/video.js"></script>
	
	<script type="text/javascript" src="js/qtip/jquery.qtip.js"></script>
	<link rel="stylesheet" type="text/css" href="js/qtip/jquery.qtip.css">
	<title>MOTORWAY : GIS แผนที่ภูมิศาสตร์สารสนเทศ</title>
</head>
<body onLoad="init()">
	<div id="header">
		<a href="#"><img id="logo" src="images/logo.png" alt="การทางพิเศษแห่งประเทศไทย"></img></a>
		<div id="header-dashboard">
		</div>
	</div>

<div id="wrapper">

	<div id="videodialog">
		<div id="video-bg">
			<div id="videopreloader" class="progress progress-striped active">
			  	<div class="bar" style="width: 40%;"></div>
			</div>
			<div id="videoplayer">
			
			</div>
			<div id="videoinfo">
				รูปที่: <div id="frameno" class="infoblock small"></div>
				ความเร็ว: <div id="framerate" class="infoblock small"></div>
				ไฟล์รูป: <div id="current_image" class="infoblock small"></div> <a class="btn btn-mini btn" target="_blank" id="saveimage" title="เซฟรูปนี้"><i class="icon-download-alt"></i></a><br>
				ตอนควบคุม: <div id="video_section" class="infoblock medium">loading...</div>
				ช่วงกม. เริ่มต้น: <div id="video_kmstart" class="infoblock small">loading...</div>
				สิ้นสุด: <div id="video_kmend" class="infoblock small">loading...</div><br>
				กม.: <div id="video_km" class="infoblock small">loading...</div>
				<span id="video_infotype_title"></span>: <div id="video_infotype" class="infoblock small">loading...</div>
				Lat: <div id="video_lat" class="infoblock medium">loading...</div>
				Long: <div id="video_long" class="infoblock medium">loading...</div><br>
			</div>
		</div>
	</div>
	
	<style type="text/css">
		.row:first-child
		{
			position: relative;
		}
	</style>
	<div class="container">
		<div id="loading" class="misc alert">Loading <img src="css/img/ajax-loader.gif"></div>
		
		<!-- ======= MAP ========== -->
		<div class="row" style="position: relative;">
			<div class="span12">	
				<div id="container_map" class="normal">
					<!-- Openlayer map's placeholder-->
					<div id="map"></div>
				</div>
			</div>
			<div id="maptoolbox">
				<div id="expnametype">
				</div>
				<div id="selectname">
					
				</div>
				<div id="damage">
				</div>
			</div>
			<div id="mapstatus"></div>
			<div id="mapicon">
				<a class="btn btn-inverse normal" title="เก็บแผนที่" id="toggle-map-display" ><i class="icon-chevron-up icon-white"></i></a>
				<a class="btn btn-inverse normal" title="ขยายแผนที่" id="maximize-map-display" ><i class="icon-resize-full icon-white"></i></a>
				<a href="#videodialog" class="btn btn-inverse normal video_lightbox" title="ดูวิดีโอ" id="video-map-display" ><i class="icon-facetime-video icon-white"></i></a>
			</div>
		</div>

		<div class="row">
			<div class="span3">
				<ul id="toolbox" class="nav nav-list toolbox">
					<li class="active toolbox-topic">
						<a><i class="icon-road icon-white"></i> 1) เลือกสายทาง</a>
					</li>

					<select name="expressway" class="expressway input-spanall">
							<option selected value="07">ทางหลวงพิเศษหมายเลข 7</option>
							<option value="09">ทางหลวงพิเศษหมายเลข 9</option>
					</select>
					<select name="exptype" class="exptype input-spanall">
							<option value="1">ทางหลัก</option>
							<option value="2">ทางกลับรถ</option>
							<option value="3">ทางรถบรรทุก</option>
							<option value="4">ทางแยก</option>
					</select>
					<li class="divider"></li>
					<div id="option1">
						เลือกตอนควบคุม: 
						<div id="notpavement">
							<select name="mainsection07" class="input-spanall mainsection seclist">
								<option value="0000">เส้นทางหลัก</option>
								<option value="0102">ทางเข้าออกสถานีขนส่งสินค้าร่มเกล้า</option>
								<option value="0302">แยกทางตอนควบคุมหมายเลข 070304 - บรรจบทางหลวงหมายเลข 34 (บางวัว)</option>
							</select>

							<select name="mainsection09" class="input-spanall mainsection seclist">
								<option value="0000">เส้นทางหลัก</option>
							</select>
						</div>
						<div id="pavement_select">
							<select name="mainsection07" class="input-spanall mainsection seclist">
								
								<option value="0101">ถนนศรีนครินทร์ - กม.22+000 (ต่อเขตแขวงฯ สมุทรปราการ)</option>
								<option value="0102">ทางเข้าออกสถานีขนส่งสินค้าร่มเกล้า</option>
								<option value="0200">กม.22+000 (ต่อเขตแขวงฯ กรุงเทพ) - กม.38+600 (ต่อเขตแขวงฯ ฉะเชิงเทรา)</option>
								<option value="0301">กม.38+600 (ต่อเขตแขวงฯ สมุทรปราการ) - กม.52+000 (ต่อเขตแขวงฯ ชลบุรี)</option>
								<option value="0302">แยกทางตอนควบคุมหมายเลข 070304 - บรรจบทางหลวงหมายเลข 34 (บางวัว)</option>
								<option value="0401">กม.52+000 (ต่อเขตแขวงฯ ฉะเชิงเทรา) - ทางแยกต่างระดับคีรี</option>
							</select>
							<select name="mainsection09" class="input-spanall mainsection seclist">
								<option value="0401">แยกทางหลวงหมายเลข 1 (บางปะอิน) - คลองระพีพัฒน์ (ต่อเขตแขวงฯ ปทุมธานี)</option>
								<option value="0402">คลองระพีพัฒน์ (ต่อเขตแขวงฯ อยุธยา) - ลำลูกการ (ต่อเขตแขวงฯ กรุงเทพ)</option>
								<option value="0500">ลำลูกกา (ต่อเขตแขวงฯ ปทุมธานี) - ประเวศ (ต่อเขตแขวงฯ สมุทรปราการ)</option>
								<option value="0600">ประเวศ (ต่อเขตแขวงฯ กรุงเทพ) - พระประแดง</option>
							</select>
						</div>
						<div id="fix_range">
							กำหนดช่วงกม.
							<div class="font16">
							เริ่ม <input placeholder="" type="text" name="kmstart" class="span1 inline" >
							สิ้นสุด <input placeholder="" type="text" name="kmend" class="span1 inline">
							</div>
							<span style="font-size:0.778em;" class="color-grey">(ช่วง กม. ที่กำหนด จะต้องมีระยะทางไม่เกิน 2 กม. เท่านั้น)</span>
						</div>
					</div>
						
						<div id="option2">
						
							<select name="accessname07" class="input-spanall accessname seclist">
							<!--	<option value="">ทางแยกต่างระดับศรีนครินทร์</option>
								<option value="">ทางแยกต่างระดับวัดสลุด</option> -->
								<option value="0101B01">ทางแยกต่างระดับร่มเกล้า</option>
							<!--	<option value="">สะพานลอยทางเข้า-ออก ท่าอากาศยานสุวรรณภูมิ</option>
								<option value="">สะพานลอยทางเข้า-ออก สถานีขนส่งสินค้าร่มเกล้า</option>
								<option value="">ทางแยกต่างระดับลาดกระบัง</option>
								<option value="">ทางแยกต่างระดับบางบ่อ</option>
								<option value="">ทางแยกต่างระดับบางควาย</option>
								<option value="">ทางแยกต่างระดับบางปะกง</option>
								<option value="">ทางแยกต่างระดับพานทอง</option>
								<option value="">ทางแยกต่างระดับชลบุรี</option>
								<option value="">ทางแยกต่างระดับบางพระ</option>	-->									
							</select>
							<select name="accessname09" class="input-spanall accessname seclist">
							<!--	<option value="">ทางแยกต่างระดับบางปะอิน</option>
								<option value="">สะพานลอยทางเข้า-ออก สถานีขนส่งสินค้าคลองหลวง</option>
								<option value="">สะพาน OVERPASS และทางแยก อ.คลองหลวง</option> -->
								<option value="0402B01">ทางแยกต่างระดับธัญบุรี</option>	
								<option value="0402B02">ทางแยกต่างระดับลำลูกกา</option>	
							<!--	<option value="">ทางแยกต่างระดับรามอินทรา</option>	-->
								<option value="0500B01">ทางแยกต่างระดับคลองกุ่ม</option>	
								<option value="0500B02">ทางแยกต่างระดับสุขาภิบาล 3</option>	
								<option value="0500B03">ทางแยกต่างระดับทับช้าง</option>	
							</select>
							<select name="enexname07" class="input-spanall enexname seclist">
								<option value="0101U01">สะพานลอยกลับรถ กม.เริ่มต้นที่ 1.5 - 1.7</option>
								<option value="0101U02">สะพานลอยกลับรถ กม.เริ่มต้นที่ 14.4 - 14.7</option>
								<option value="0101U03">สะพานลอยกลับรถ กม.เริ่มต้นที่ 9.6 - 9.2</option>
								<option value="0302U01">ที่กลับรถแยกต่างระดับบางบ่อ</option>
								<option value="0302U02">ที่กลับรถแยกต่างระดับบางควาย</option>
							</select>
							
							<select name="enexname09" class="input-spanall enexname seclist">
								<option value="0401U01">ที่กลับรถแยกต่างระดับบางปะอิน</option>
								<option value="0402U01">ที่กลับรถแยกต่างระดับธัญบุรี (ไป อ.บางปะอิน)</option>
								<option value="0402U02">ที่กลับรถแยกต่างระดับธัญบุรี (ไป อ.บางพลี)</option>
								<option value="0500U01">ที่กลับรถแยกต่างระดับรามอินทรา</option>
								<option value="0500U04">ที่กลับรถแยกต่างระดับทับช้าง (ไป อ.บางปะกง)</option>
								<option value="0500U05">ที่กลับรถแยกต่างระดับทับช้าง (ไป อ.บางพลี)</option>
							</select>

							<select name="intersect07" class="input-spanall intersect seclist">
								<option value="0101113F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาออก กรุงเทพ-ชลบุรี</option>
								<option value="0101121F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาเข้า รามคำแหง-กรุงเทพ</option>
								<option value="0101123F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาออก รามคำแหง-ชลบุรี</option>
								<option value="0101132F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาเข้า ชลบุรี-รามคำแหง</option>
								<option value="0101134F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาออก ชลบุรี-บางนา</option>
								<option value="0101143F1">ทางแยกต่างระดับศรีนครินทร์ ถนนฝั่งขาเข้า บางนา-ชลบุรี</option>							
																						
								<option value="0101212F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาออก กรุงเทพ-มีนบุรี </option>
								<option value="0101214F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาเข้า กรุงเทพ-ลาดกระบัง</option>
								<option value="0101221F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาเข้า มีนบุรี-กรุงเทพ</option>
								<option value="0101223F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาออก มีนบุรี-ชลบุรี</option>
								<option value="0101234F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาออก ชลบุรี-ลาดกระบัง</option> 
								<option value="0101241F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาออก ลาดกระบัง-กรุงเทพ</option>
								<option value="0101243F1">ทางแยกต่างระดับร่มเกล้า ถนนฝั่งขาเข้า ลาดกระบัง-ชลบุรี</option>
											
								<option value="0101314F1">ทางแยกต่างระดับเข้า-ออกสนามบินสุวรรณภูมิ ถนนฝั่งขาออก กรุงเทพ-สนามบินสุวรรณภูมิ </option>
								<option value="0101334F1">ทางแยกต่างระดับเข้า-ออกสนามบินสุวรรณภูมิ ถนนฝั่งขาออก ชลบุรี- สถานีขนส่งสินค้าร่มเกล้า</option>
								<option value="0101341F1">ทางแยกต่างระดับเข้า-ออกสนามบินสุวรรณภูมิ สนามบินสุวรรณภูมื-กรุงเทพ</option>
								<option value="0101343F1">ทางแยกต่างระดับเข้า-ออกสนามบินสุวรรณภูมิ ถนนฝั่งขาออก สนามบินสุวรรณภูมิ-ชลบุร</option>

								<option value="0101412F1">ทางแยกต่างระดับลาดกระบัง</option> 
								<option value="0101421F1">ทางแยกต่างระดับลาดกระบัง ถนนฝั่งขาออก มีนบุรี-กรุงเทพ</option>
								<option value="0101423F1">ทางแยกต่างระดับลาดกระบัง ถนนฝั่งขาออก มีนบุรี-ชลบุรี</option>
								<option value="0101434F1">ทางแยกต่างระดับลาดกระบัง ถนนฝั่งขาออก ชลบุรี-อ่อนนุช</option>

								<option value="0302114F2">ทางแยกต่างระดับบางควาย ถนนฝั่งขาออก กรุงเทพ-บางนา ตราด</option>
								<option value="0302143F1">ทางแยกต่างระดับบางควาย ถนนฝั่งขาเข้า บางนา ตราด-ชลบุรี</option>
								<option value="0302134F1">ทางแยกต่างระดับบางควาย ถนนฝั่งขาออก ชลบุรี- บางนาตราด</option>
								<option value="0302141F1">ทางแยกต่างระดับบางควาย ถนนฝั่งขาเข้า บางนา ตราด-กรุงเทพ</option>
								
								<option value="0302212F1">ทางแยกต่างระดับบางบ่อ ถนนฝั่งขาออก กรุงเทพ-ชลบุรี(สายใหม่)-ชลบุร</option>
								<option value="0302231F1">ทางแยกต่างระดับบางบ่อ ถนนฝั่งขาเข้า ชลบุรี-กรุงเทพ-ชลบุรี(สายใหม่) </option>
								<option value="0302214F1">ทางแยกต่างระดับบางบ่อ ถนนฝั่งขาเข้า กรุงเทพ-ชลบุรี(สายใหม่)- กรุงเทพ</option>								
								<option value="0302241F1">ทางแยกต่างระดับบางบ่อ</option>

								<!--<option value="0301112F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาออก กรุงเทพ-บางประกง </option>
								<option value="0301123F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาออก บางประกง-ชลบุรี</option>
								<option value="0301134F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาเข้า ชลบุรี-สุขุมวิท</option>
								<option value="0301141F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาเข้า สุขุมวิท-กรุงเทพ</option>
								<option value="0301114F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาออก กรุงเทพ-สุขุมวิท</option>
								<option value="0301121F1">ทางแยกต่างระดับบางประกง ถนนฝั่งขาเข้า บางประกง-กรุงเทพ</option>-->

								<option value="0401123F1">ทางแยกต่างระดับพานทอง</option>
								<option value="0401143F1">ทางแยกต่างระดับพานทอง ถนนฝั่งขาออก ชลบุรี-ชลบุร</option>
								<option value="0401141F1">ทางแยกต่างระดับพานทอง ถนนฝั่งขาออก ชลบุรี-กรุงเทพ</option>
								<option value="0401134F1">ทางแยกต่างระดับพานทอง ถนนฝั่งขาเข้า ชลบุรี-ชลบุรี</option>
					
								<option value="0401212F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาออก กรุงเทพ-บ้านบึง</option>
								<option value="0401223F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาออก บ้านบึง-ชลบุรี</option>
								<option value="0401234F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาออก ชลบุรี-ชลบุรี</option>
								<option value="0401241F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาเข้า ชลบุรี-ชลบุรี</option>
								<option value="0401243F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาเข้า บ้านบึง-กรุงเทพ</option>
								<option value="0401221F1">ทางแยกต่างระดับชลบุรี ถนนฝั่งขาเข้า ชลบุรี-บ้านบึง</option>
								
								
							</select>

							<select name="intersect09" class="input-spanall intersect seclist">
								<option value="0401141F1">ทางแยกต่างระดับบางปะอิน ถนนฝั่งขาเข้า กรุงเทพฯ-บางพลี </option>
								<option value="0401132F1">ทางแยกต่างระดับบางปะอิน ถนนฝั่งขาออก บางพลี-สระบุรี </option>
								<option value="0401123F1">ทางแยกต่างระดับบางปะอิน ถนนฝั่งขาเข้า สระบุรี-บางพลี </option>
								<option value="0401134F1">ทางแยกต่างระดับบางปะอิน ถนนฝั่งขาออก บางพลี-กรุงเทพ</option>
								
								<option value="0402112F1">คลองหลวง ถนนฝั่งขาเข้า บางประอิน-หนองเสือ</option>
								<option value="0402123F1">คลองหลวง ถนนฝั่งขาเข้า หนองเสือ-บางพลี </option>
								<option value="0402134F1">คลองหลวง ถนนฝั่งขาออก บางพลี-คลองหลวง</option>
								<option value="0402141F1">คลองหลวง ถนนฝั่งขาออก คลองหลวง-บางประอิน</option>

								<option value="0402212F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาเข้า บางประอิน-นครนายก</option>
								<option value="0402223F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาเข้า นครนายก-บางพลี </option>		
								<option value="0402234F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาออก บางพลี-รังสิต</option>
								<option value="0402241F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาออก รังสิต-บางประอิน </option>
								<option value="0402243F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาเข้า รังสิต-บางพลี</option>
								<option value="0402232F1">ทางแยกต่างระดับธัญบุรี ถนนฝั่งขาออก บางพลี-นครนายก </option>

								<option value="0402312F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาเข้า บางประอิน-ลำลูกกา</option>
								<option value="0402323F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาเข้า ลำลูกกา-บางพลี </option>
								<option value="0402334F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาออก บางพลี-ดอนเมือง </option>
								<option value="0402341F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาออก ดอนเมือง-บางประอิน </option>
								<option value="0402343F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาเข้า บางประอิน-ดอนเมือง </option>							
								<option value="0402321F1">ทางแยกต่างระดับลำลูกกา ถนนฝั่งขาออก ลำลูกกา-บางประอิน </option>
																
								<option value="0500112F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาเข้า บางประอิน-มีนบุรี</option>
								<option value="0500121F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาออก มีนบุรี-บางประอิน</option>
								<option value="0500123F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาเข้า มีนบุรี-บางพลี</option>
								<option value="0500143F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาเข้า หลักสี่-บางพลี</option>
								<option value="0500134F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาออก บางพลี-หลักสี่</option>
								<option value="0500141F1">ทางแยกต่างระดับรามอินทรา ถนนฝั่งขาออก หลักสี่-บางประอิน</option>
								
								<option value="0500212F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาเข้า บางประอิน-มีนบุรี </option>
								<option value="0500223F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาเข้า มีนบุรี-บางพลี</option>
								<option value="0500234F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาออก บางพลี-บางกะปิ</option>
								<option value="0500241F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาออก บางกะปิ-บางปะอิน</option>
								<option value="0500243F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาเข้า บางกะปิ-บางพลี</option>
								<option value="0500214F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาเข้า บางประอิน-บางกะปิ</option>
								<option value="0500221F1">ทางแยกต่างระดับคลองกุ่ม ถนนฝั่งขาออก มีนบุรี-บางประอิน </option>						
																			
								<option value="0500312F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาเข้า บางประอิน-มีนบุรี </option>
								<option value="0500323F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาเข้า มีนบุรี-บางพลี </option>
								<option value="0500334F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาออก บางพลี-บางกะปิ</option>
								<option value="0500341F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาออก บางกะปิ-บางปะอิน</option>
								<option value="0500321F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาออก มีนบุรี-บางประอิน</option>
								<option value="0500314F1">ทางแยกต่างระดับสุขาภิบาล3 ถนนฝั่งขาเข้า บางประอิน-บางกะปิ</option>

								<option value="0500412F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาเข้า บางประอิน-ชลบุรี</option>
								<option value="0500423F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาเข้า ชลบุรี-บางพลี</option>
								<option value="0500434F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาออก บางพลี-ศรีนครินทร์</option>
								<option value="0500441F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาออก ศรีนครินทร์-บางปะอิน</option>
								<option value="0500443F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาเข้า ศรีนครินทร์-บางพลี</option>
								<option value="0500414F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาเข้า บางพลี ศรีนครินทร์</option>
								<option value="0500421F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาออก ชลบุรี-บางประอิน</option>
								<option value="0500432F1">ทางแยกต่างระดับทับช้าง ถนนฝั่งขาออก บางพลี-ชลบุรี</option>
																
								<option value="0500512F1">ทางแยกต่างระดับอ่อนนุช ถนนฝั่งขาเข้า บางประอิน-ลาดกระบัง</option>
								<option value="0500523F1">ทางแยกต่างระดับอ่อนนุช ถนนฝั่งขาเข้า ลาดกระบัง-บางพลี</option>
								<option value="0500534F1">ทางแยกต่างระดับอ่อนนุช ถนนฝั่งขาออก บางพลี-ศรีนครินทร์</option>
								<option value="0500541F1">ทางแยกต่างระดับอ่อนนุช ถนนฝั่งขาออก ศรีนครินทร์-บางประอินทร์</option>
								<option value="0500532F1">ทางแยกต่างระดับอ่อนนุช ถนนฝั่งขาออก บางพลี-ลาดกระบัง</option>
								
								<option value="0600112F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาเข้า บางประอิน-ชลบุรี</option>
								<option value="0600123F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาออก ชลบุรี-สมุทรปราการ</option>
								<option value="0600134F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาเข้า สมุทรปราการ-บางนา</option>
								<option value="0600141F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาออก บางนา-บางปะอิน</option>
								<option value="0600143F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาออก บางนา-สมุทรปราการ</option>
								<option value="0600114F1">ทางแยกต่างระดับวัดสลุด ถนนฝั่งขาเข้า บางปะอิน-บางนา</option>					
								
							</select>
						</div>

						
					<li class="divider"></li>
					<li class="active toolbox-topic">
						<a><i class="icon-search icon-white"></i> 2.1) ข้อมูลที่ต้องการเรียกดู </a>
					</li>

					<li class="toolbox-content">
						<form class="">
						
						<label class="radio">
							<input name="infotype" value="texture" type="radio"><span>ค่าพื้นผิว - Texture</span>
						</label>						
						<label class="radio">
							<input checked name="infotype" value="roughness" type="radio"><span>ค่าความขรุขระ - IRI</span>
						</label>
						<label class="radio">
							<input name="infotype" value="rutting" type="radio"><span>ค่าร่องล้อ - Rutting</span>
						</label>
						<label class="radio">
							<input name="infotype" value="pavement" type="radio"><span>Pavement</span>
						</label>

						<div align="right"><button id="search" type="submit" class="btn btn-small btn-primary">เรียกดู</button></div>
						</form>
					</li>
					<li class="divider"></li>
					<li class="active toolbox-topic">
						<a><i class="icon-wrench icon-white"></i> 2.2) แผนการซ่อมบำรุง</a>
					</li>
					<li class="toolbox-content">
						<form class="">
						<select id="hdm4type" name="hdm4type" class="input-spanall">
							<option value="unlimited" >แบบไม่จำกัดงบ</option>
							<option value="limited_half">แบบที่ 1 อ้างอิงงบปี 55</option>
							<option value="limited_full">แบบที่ 2 เพิ่มอีก 10%</option>
						</select>
						<label class="radio">
							<input name="hdm4year" value="2556" type="radio">2556: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2557" type="radio">2557: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2558" type="radio">2558: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2559" type="radio">2559: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2560" type="radio">2560: HDM4 Plan
						</label>
						<label class="radio">
							<input checked name="hdm4year" value="all" type="radio">ทุกปี: HDM4 Plan
						</label>

						<div align="right"><button id="search_hdm4_button" type="submit" class="btn btn-small btn-primary">เรียกดู</button></div>
						</form>
					</li>	
				</ul>
				
			</div>

			<div id="placeholder" class="span9"></div>

			<!-- Main Content -->
			<div id="main_content" class="span9">
				<!-- Pavement  -->
				<div id="pavement">
					<h1>Pavement<div></div></h1>
					<div>
						<div id="pavement_lane">

						</div>
						<div class="mybuttongroup">
							
							<form id="genpdf" method="POST" style="display:inline-block;" action="topdf.php">
								<a href="#" target="blank" id="pavementpdf" class="btn btn-small"><img src="images/icon_pdf.png" title="export pdf file" width=18> PDF</a>
								<input type="hidden" name="pdffilename" value="">
							</form>
							<form id="genexcel" target="_blank" method="POST" style="display:inline-block;" action="excel.php">
								<a href="#" id="pavementexcel" class="btn btn-small"><img src="images/icon_excel.png" title="export excel file" width=18> Excel</a>
								<input type="hidden" name="head" value="">
								<input type="hidden" name="exceldata" value="">
								<input type="hidden" name="columns" value="">
								<input type="hidden" name="type" value="pavement">
							</form>
						</div>
					</div>
					<table id="pavement_table" class="table table-condensed table-bordered">
					</table>

					<div id="pavementpager" class="pager">
						<form>
							<img src="css/tablesorter/first.png" class="first"/>
							<img src="css/tablesorter/prev.png" class="prev"/>
							<input type="text" class="pagedisplay span1"/>
							<img src="css/tablesorter/next.png" class="next"/>
							<img src="css/tablesorter/last.png" class="last"/>
							<select class="pagesize span1" style="display:none;">
								<option selected="selected"  value="20">20</option>
							</select>
						</form>
					</div>
				</div>
				<!-- HDM4 -->
				<div id="hdm4result">
					<h1>แผนการซ่อมบำรุง<div></div></h1>
					<div>
						<h3>สายทาง: <span class="expressway color-orange expressway"></span></h3>
					<!-- 	<h3>ตอนควบคุม: <span class="section color-orange"></span></h3> -->
						<h3 class="inline">ตอนควบคุม: </h3>
						<div class="resultoptionchange" class="btn-group">
							  <a class="dropdown-toggle" data-toggle="dropdown" href="#">
							  <span class="section"></span>
							    <span style="vertical-align:middle;" class="caret"></span>
							  </a>
							  <ul id="hdm4sectiondropdown" class="dropdown-menu">
							    <li><a href=""></a></li>
							    <li><a href=""></a></li>
							    <li><a href=""></a></li>
							    <li><a href=""></a></li>
							    <li><a href=""></a></li>
							    <li><a href=""></a></li>
							  </ul>
						</div>
						<br>
						<h3 class="inline">ปี: </h3>
						<div class="resultoptionchange" class="btn-group">
							  <a class="dropdown-toggle" data-toggle="dropdown" href="#">
							  <span class="hdm4year"></span>
							    <span style="vertical-align:middle;" class="caret"></span>
							  </a>
							  <ul id="hdm4yeardropdown" class="dropdown-menu">
							    <li><a href="">2556</a></li>
							    <li><a href="">2557</a></li>
							    <li><a href="">2558</a></li>
							    <li><a href="">2559</a></li>
							    <li><a href="">2560</a></li>
							    <li><a href="">ทุกปี</a></li>
							  </ul>
						</div>
						
					<br>
					<h3>Budget Scenario: <span class="hdm4type color-orange"></span></h3>	
					
					<div class="right" id="totalcost">
						
					</div>

						<div class="mybuttongroup">
							<a href="#" id="hdm4graph" class="fancyimage btn btn-small"><img src="images/icon_chart.png" title="ดูกราฟ" width=18> กราฟ</a>
							<form id="genpdf" method="POST" style="display:inline-block;" action="topdf.php">
								<a href="#" target="blank" id="hdm4pdf" class="btn btn-small"><img src="images/icon_pdf.png" title="export pdf file" width=18> PDF</a>
								<input type="hidden" name="pdffilename" value="">
							</form>
							<form id="genexcel" target="_blank" method="POST" style="display:inline-block;" action="excel.php">
								<a href="#" id="hdm4excel" class="btn btn-small"><img src="images/icon_excel.png" title="export excel file" width=18> Excel</a>
								<input type="hidden" name="head" value="">
								<input type="hidden" name="exceldata" value="">
							</form>
						</div>
					</div>
					
					<table id="hdm4table" class="table table-condensed table-bordered">
					</table>

					
					<div id="hdm4pager" class="pager">
						<form>
							<img src="css/tablesorter/first.png" class="first"/>
							<img src="css/tablesorter/prev.png" class="prev"/>
							<input type="text" class="pagedisplay span1"/>
							<img src="css/tablesorter/next.png" class="next"/>
							<img src="css/tablesorter/last.png" class="last"/>
							<select class="pagesize span1" style="display:none;">
								<option selected="selected"  value="20">20</option>
							</select>
						</form>
					</div>

				</div>

				<!-- Damage Search -->
				<div id="damagesearch">
				<div id="search-input" class="alert alert-warning font16">
					<span class="expressway"></span> • <span class="fullname"></span> • <span class="infotype"></span> • กม.<span class="rangekm"></span>
				</div>

				<div class="row" style="margin-bottom:25px;">
					<div id="center_container" class="span9">

						<div id="current_linedata">
							<span class="ydata"></span>ม. / กม.<br>
							กม. <span class="selectedkm"></span>
						</div>

						<div class="row" id="center_container-toolbox">
							
							<div class="span3">
								<div id="lane_selection">
									
								</div>	
								<div id="pager" class="pager">
									<form>
										<img src="css/tablesorter/first.png" class="first"/>
										<img src="css/tablesorter/prev.png" class="prev"/>
										<input type="text" class="pagedisplay span1"/>
										<img src="css/tablesorter/next.png" class="next"/>
										<img src="css/tablesorter/last.png" class="last"/>
										<select class="pagesize span1" style="display:none;">
											<option selected="selected"  value="30">30</option>
										</select>
									</form>
								</div>
							&nbsp;
							</div>

							<div class="span3" style="padding-top:10px;"> 
								เลือกช่วงกม. : <span id="range" class="color-orange"></span><div id="slider-range"></div>
							</div>
							<div class="span3">
								<div id="search-detail" class="center">
									แสดงผล ทุกๆ <br>
									<div class="input-prepend input-append">
                						<button class="btn button-once"><i class="icon-arrow-left"></i></button><span style="width:30px;" id="kmfreq" class="center input uneditable-input kmfreq">25</span><button id="fqright" class="btn button-once"><i class="icon-arrow-right"></i></button> ม.
              						</div>
								</div>
								<div id="center-button" class="center">
									<a href="#" id="exportPDF" style="margin-bottom:3px;" class="btn btn-small"><i class="icon-print"></i> พิมพ์</a>
									<a href="#videodialog" class="btn btn-small video_lightbox"><i class="icon-facetime-video"></i> วีดีโอ</a>
								</div>
							</div>
						</div>
						<div id="line-chart" >LINE CHART</div>

						
						
					</div>
					
				</div>
			
				<div class="row">
					<div class="span4">
						
						<table id="table1" class="table table-condensed table-bordered table-detailed">
						 	<thead>
						    	<tr>
								    <th >กม.</th>
								    <th >ความเสียหาย <br>(ม./กม.)</th>
						    	</tr>
						  	</thead>
						  	<tbody>
						    	
						    	
						  	</tbody>
						</table>
					</div>
					<div class="span5">
						<div class="thumbnail" id="video_container">
							
								<!--<div id="video_container-titlebar">&nbsp;</div>-->
								
							
							<div id="video-player">
								<div id="thumbnail">
									<img src="images/imgerror.gif" />
								</div>
								<div id="reel_container" >
								</div>
							</div>
							<div id="video-detail">
							<table class="table-condensed table">
									<tbody>
										<tr>
											<td>รหัสตอนควบคุม</td>
											<td>: <span class="control-section color-orange"></span></td>
										</tr>
										<tr>
											<td>ช่วง กม. </td>
											<td>: <span class="color-orange selectedkm"></span>
											</td>
										</tr>
										<tr>
											<td>Lat/Long</td>
											<td>: <span class="latitute color-orange"></span>
											&nbsp;<span class="longtitute color-orange"></span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div> <!-- END DAMAGE SEARCH-->
			</div>
		</div>
	</div>
</div>
</body>
</html>
