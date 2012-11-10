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
	<!--<script type="text/javascript" src="js/openlayer/googlemap.js"></script>-->
	<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
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
							<option value="1">ทางหลัก M</option>
							<option value="2">ทางกลับรถ U </option>
							<option value="3">ทางข้ามแยก B</option>
							<option value="4">ทางแยก #</option>
					</select>
					<li class="divider"></li>
					<div id="option1">
						เลือกตอนควบคุม: 
						<select name="mainsection07" class="input-spanall mainsection">
							<option value="0102">0102</option>
							<option value="0101">0101</option>
							<option value="0200">0200</option>
							<option value="0301">0301</option>
							<option value="0302">0302</option>
							<option value="0401">0401</option>
						</select>
						<select name="mainsection09" class="input-spanall mainsection">
							<option value="0401">0401</option>
							<option value="0402">0402</option>
							<option value="0500">0500</option>
							<option value="0600">0600</option>
						</select>
						<div id="fix_range">
							กำหนดช่วงกม.
							<div class="font16">
							เริ่ม <input placeholder="" type="text" name="kmstart" class="span1 inline" >
							สิ้นสุด <input placeholder="" type="text" name="kmend" class="span1 inline">
							</div>
							<span style="font-size:0.778em;" class="color-grey">(ช่วง กม. ที่กำหนด จะต้องมีระยะทางไม่เกิน 2 กม. เท่านั้น))</span>
						</div>
					</div>
						
						<div id="option2">
						
							<select name="accessname07" class="input-spanall accessname">
								<option value="">ทางแยกต่างระดับศรีนครินทร์</option>
								<option value="">ทางแยกต่างระดับทับช้าง</option>
								<option value="">ทางแยกต่างระดับอ่อนนุช</option>
								<option value="">ทางแยกต่างระดับวัดสลุด</option>
								<option value="">ทางแยกต่างระดับร่มเกล้า</option>
								<option value="">สะพานลอยทางเข้า-ออก ท่าอากาศยานสุวรรณภูมิ</option>
								<option value="">สะพานลอยทางเข้า-ออก สถานีขนส่งสินค้าร่มเกล้า</option>
								<option value="">ทางแยกต่างระดับลาดกระบัง</option>
								<option value="">ทางแยกต่างระดับบางบ่อ</option>
								<option value="">ทางแยกต่างระดับบางควาย</option>
								<option value="">ทางแยกต่างระดับบางปะกง</option>
								<option value="">ทางแยกต่างระดับพานทอง</option>
								<option value="">ทางแยกต่างระดับชลบุรี</option>
								<option value="">ทางแยกต่างระดับบางพระ</option>										
							</select>
							<select name="accessname09" class="input-spanall accessname">
								<option value="">ทางแยกต่างระดับบางปะอิน</option>
								<option value="">สะพานลอยทางเข้า-ออก สถานีขนส่งสินค้าคลองหลวง</option>
								<option value="">สะพาน OVERPASS และทางแยก อ.คลองหลวง</option>
								<option value="">ทางแยกต่างระดับธัญบุรี</option>	
								<option value="">ทางแยกต่างระดับลำลูกกา</option>	
								<option value="">ทางแยกต่างระดับรามอินทรา</option>	
								<option value="">ทางแยกต่างระดับคลองกุ่ม</option>	
								<option value="">ทางแยกต่างระดับสุขาภิบาล 3</option>	
								<option value="">ทางแยกต่างระดับทับช้าง</option>	
							</select>
							<select name="enexname07" class="input-spanall enexname">
								<option value="">0101U01</option>
								<option value="">0101U02</option>
								<option value="">0101U03</option>
								<option value="">0302U01</option>
								<option value="">0302U02</option>
							</select>
							
							<select name="enexname09" class="input-spanall enexname">
								<option value="">0401U01</option>
								<option value="">0402U01</option>
								<option value="">0402U02</option>
								<option value="">0500U01</option>
								<option value="">0500U04</option>
								<option value="">0500U05</option>
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
							<option value="limited_half">แบบครึ่งงบ</option>
							<option value="limited_full">แบบเต็มงบ</option>
						</select>
						<label class="radio">
							<input checked name="hdm4year" value="2013" type="radio">2556: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2014" type="radio">2557: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2015" type="radio">2558: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2016" type="radio">2559: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="2017" type="radio">2560: HDM4 Plan
						</label>
						<label class="radio">
							<input name="hdm4year" value="all" type="radio">ทุกปี: HDM4 Plan
						</label>

						<div align="right"><button id="search_hdm4_button" type="submit" class="btn btn-small btn-primary">เรียกดู</button></div>
						</form>
					</li>	
				</ul>
				
			</div>

			<div id="placeholder" class="span9"></div>

			<!-- Main Content -->
			<div id="main_content" class="span9">
				
				<!-- HDM4 -->
				<div id="hdm4result">
					<h1>แผนการซ่อมบำรุง<div></div></h1>
					<div>
						<h3>สายทาง: <span class="hdm4result-expressway color-orange expressway"></span></h3><br>
						<h3>ปี: </h3>
						<div class="resultoptionchange" class="btn-group">
							  <a class="dropdown-toggle" data-toggle="dropdown" href="#">
							  <span class="hdm4result-year hdm4year"></span>
							    <span style="vertical-align:middle;" class="caret"></span>
							  </a>
							  <ul class="dropdown-menu">
							    <li><a href="">2556</a></li>
							    <li><a href="">2557</a></li>
							    <li><a href="">2558</a></li>
							    <li><a href="">2559</a></li>
							    <li><a href="">2560</a></li>
							    <li><a href="">ทุกปี</a></li>
							  </ul>
						</div>
					<br>
					<h3>Budget Scenario: <span class="hdm4result-type hdm4type color-orange"></span></h3>	
					
					<div class="right" id="totalcost">
						
					</div>

						<div id="hdm4buttongroup">
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
									เลือกเลน : 
									<select id="mainLane" name="mainLane" class="mainLane">
										<option value="F1">F1</option>
										<option value="F2">F2</option>
										<option value="F3">F3</option>
										<option value="F4">F4</option>
										<option value="R1">R1</option>
										<option value="R2">R2</option>
										<option value="R3">R3</option>
										<option value="R4">R4</option>
									</select>
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
<div id="footer">พัฒนาโดย สำนักวิจัยและให้คำปรึกษา มหาวิทยาลัยธรรมศาสตร์ :: พบข้อผิดพลาดของโปรแกรม โปรดติดต่อ iamnotkorr@gmail.com</div>
</body>
</html>
