<?php
session_start();
$_SESSION['open'] = true;
//Get data of damage result
$expressway = $_POST['expressway'];
$infotype = $_POST['infotype'];
$section = $_POST['section'];
$code = $_POST['code'];
$fullname = $_POST['fullname'];
$kmrange = $_POST['kmrange'];
$kmfreq = $_POST['kmfreq'];
$data_inrange = $_POST['data_inrange'];
$xaxis= $_POST['xaxis'];
$yaxis = $_POST['yaxis'];
$xgridpxa = $_POST['xgridpx'];
$ygridpx = pxToMm($_POST['ygridpx']);
$currentImage =   $_POST['currentImage'];
$currentlong =   $_POST['currentlong'];
$currentlat =   $_POST['currentlat'];
$currentkm =   $_POST['currentkm'];
/*$firstImage =  $_POST['firstImage'];
$lastImage =  $_POST['lastImage'];
$firstkm = $_POST['firstkm'];
$firstlat = $_POST['firstlat'];
$firstlong =  $_POST['firstlong'];
$lastkm = $_POST['lastkm'];
$lastlat =  $_POST['lastlat']; 
$lastlong = $_POST['lastlong'];*/


if(isset($_POST["canvasData"]))
{
    // Get the data
    $imageData=$_POST["canvasData"];
    // Remove the headers (data:,) part.  
    // A real application should use them according to needs such as to check image type
    $filteredData=substr($imageData, strpos($imageData, ",")+1);
    // Need to decode before saving since the data we received is already base64 encoded
    $unencodedData=base64_decode($filteredData);
}

//Get data of hdm4 result
$year = $_POST['year'];
$hdm4type = $_POST['hdm4type'];
$hdm4data = $_POST['hdm4data'];
$totalcost = $_POST['totalcost'];

//Check what type of pdf
$pdftype = "damage";
if($year)
    $pdftype = "hdm4";

//Require tcpdf class
require_once('tcpdf/config/lang/eng.php');
require_once('tcpdf/tcpdf.php');

// Extend the TCPDF class to create custom Header and Footer
class MYPDF extends TCPDF {
    //Page header
    public function Header() {
        // Logo
        $image_file = K_PATH_IMAGES.'logo.jpg';
       $this->Image($image_file, 10, 10, 18, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
        // Set font
        $this->SetFont('thsarabun', 'B', 24);
        // Title Thai
        $this->setCellMargins(5, 5, '', '');
        $this->Cell(0, 15, 'กองทางหลวงพิเศษระหว่างเมือง กรมทางหลวง', 0, false, 'L', 0, '', 0, false, 'M', 'M');
		$this->Ln(7.5);
        //Set font
        $this->SetFont('thsarabun', 'B', 18);
 		$this->setCellMargins(18.3, '', '', '');
        //Tital English
        $this->Cell(0, 15, 'Department of Highway', 0, false, 'L', 0, '', 0, false, 'M', 'M');
        //Add Horizontal Line
        $style = array('width' => 0.5, 'cap' => 'butt', 'join' => 'miter', '', 'phase' => 10, 'color' => array(0, 0, 0));
    	$this->Line(10, 27, 200, 27, $style);
        $this->Ln(10);
    }
    // Page footer
    public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('thsarabun', '', 14);
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'R', 0, '', 0, false, 'T', 'M');
    }
}
// ------------- SET METADATA, HEADER , FOOTER -------------------------------------------------
// create new PDF document
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('EXAT');
$pdf->SetTitle('EXAT');
$pdf->SetSubject('EXAT');
$pdf->SetKeywords('EXAT');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

//set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

//set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

//set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

//set some language-dependent strings
$pdf->setLanguageArray($l);

// ---------------------------------------------------------

//------------------- INFORMATION --------------------------------------
// ==== of DAMAGE RESULT
if($pdftype == "damage")
{
    // set font
    $pdf->SetFont('thsarabun', '', 16);

    // add a page
    $pdf->AddPage();

    $pdf->Ln(4);
    //html
    $html = '<table border="0" cellpadding="1">
    	<tr style="line-height:4px;">
    		<td width="130"><b>ข้อมูลแสดง</b></td>
    		<td width="10">:</td>
    		<td width="400">'.$infotype.'</td>
    	</tr>
    	<tr style="line-height:4px;">
    		<td width="130"><b>สายทาง/ชื่อย่อการทาง</b></td>
    		<td width="10">:</td>
    		<td align="left" width="400">'.$expressway.'</td>
    	</tr>
        <tr>
            <td width="130">&nbsp;</td>
            <td width="10">:</td>
            <td align="left" width="400">'.$fullname.' ('.$code.')</td>
        </tr>
    	<tr style="line-height:4px;">
    		<td width="130"><b>ช่วง กม.</b></td>
    		<td width="10">:</td>
    		<td width="400">'.$kmrange.' กม.</td>
    	</tr>
    	<tr style="line-height:4px;">
    		<td width="130"><b>ความถี่</b></td>
    		<td width="10">:</td>
    		<td width="400">ทุกๆ '.$kmfreq.' ม.</td>
    	</tr>
    </table>';

    $pdf->writeHTML($html, true, false, true, false, '');

    // ----- Add Chart Image -----
        // set JPEG quality
        $pdf->setJPEGQuality(100);
        // The '@' character is used to indicate that follows an image data stream and not an image file name
        $pdf->Image('@'.$unencodedData,'','','','','','','',false,300,'L',false,false,0,'','',false,false);
    
    // ----- Axis Data -----
    $pdf->SetFont('thsarabun', '', 12);
    //first x-grid
    //oldvaelu + 45
    $startxaxis = pxToMm($xgridpxa[0])+17;
    $pdf->SetXY($startxaxis, 127);
    $pdf->writeHTML($xaxis[0], true, false, true, false, '');
    $xgridpx = pxToMm($xgridpxa[1] - $xgridpxa[0]);
    for($i=1;$i<sizeof($xaxis);$i++)
    {    
        $pdf->SetXY($startxaxis+$i*($xgridpx+1.35), 127);
        $pdf->writeHTML($xaxis[$i], true, false, true, false, '');
    }
    for($i=0, $j=sizeof($yaxis);$i<$j;$i++)
    {
        //oldvalue +40
        $pdf->SetXY(15, 122 - $i*($ygridpx+0.5));
        $pdf->writeHTML($yaxis[$i], true, false, true, false, '');
    }

    //Image Thumbnail
    // Image example with resizing
    //$imgpath = "../asset_images/".$section."/";

    if($currentImage)
    {
        $imgpath .= $currentImage;
        $pdf->Image($imgpath, 150 , 82, 50, '', '', '', '', true, 300, '', false, false, 1, false, false, false);
        
        $pdf->writeHTMLCell(50,'', 150 , 119, 'ช่วงกม. : '.$currentkm,0,'', false, true, 'R', '');
        $pdf->writeHTMLCell(50,'', 150 , 123, 'Lat : '.$currentlat,0,'', false, true, 'R', '');
        $pdf->writeHTMLCell(50,'', 150 , 127, 'Long : '.$currentlong,0,'', false, true, 'R', '');
        //($currentkm.$currentlat.$currentlong
    }

    //Set Y Position to below the chart
    if($currentImage || $firstImage)
        $pdf->Ln(14);
    else
        $pdf->Ln(58);

    // get current vertical position
    $y = $pdf->getY();
    $x = $pdf->getX();

    $pdf->SetXY($x,$y);
    
    // set font
    $pdf->SetFont('thsarabun', '', 14);

    // ----- Add Table Data -----
    $datasize = sizeof($data_inrange);
    $count = 0;
    $tablenum = 0;
    $perpage = 16;
    $rownum = 0;
    $x = $pdf->getX();
    $y = $pdf->getY();
    $html = '<table align="center" border="1" cellpadding="1" ><tr><th align="center" width="180">กม.</th><th align="center" width="120">'.$infotype.' (ม./กม.)</th></tr>';
    while($count <= $datasize)
    {
    /*
        if($count%2 == 0)
            $html .= '<tr>';
        else
            $html .= '<tr style="background-color: rgb(245, 245, 245);">';
        */
        $cond = $infotype;
        if($cond == 'ค่าความขรุขระ - IRI') {
		    if($data_inrange[$count][1] < 2.68)
		    	$html .= '<tr style="background-color: #c6efce;color:#006100">'; 
		    else if($data_inrange[$count][1] >= 2.68 and $data_inrange[$count][1] < 3.5)
		    	$html .= '<tr style="background-color: #ffeb9c;color:#8e5c00">';
		    else if($data_inrange[$count][1] >= 3.5)
		    	$html .= '<tr style="background-color: #ffc7ce;color:#a41118">';        
        } else if($cond == 'ค่าร่องล้อ - Rutting') {
		    $html .= '<tr style="background-color: #c6efce">'; 
        } else if($cond == 'ค่าความฝืด - Skid') {
        	if($data_inrange[$count][1] > 0.3)
        		$html .= '<tr style="background-color: #c6efce">'; 
        	if($data_inrange[$count][1] <= 0.3)
        		$html .= '<tr style="background-color: #ffc7ce">'; 
        } else {
        	$html .= '<tr>';
        }  
        
        $html .= '<td align="center">'.$data_inrange[$count][0].'</td>';
        $html .= '<td align="center">'.$data_inrange[$count][1].'</td>';
        $html .= '</tr>';

        $rownum++;
        $count++;

        if($rownum == $perpage || $count == $datasize)
        {     
            $html .= '</table>';
            $x = $pdf->getX();
            if($tablenum%2 == 1)
                $x += 15;
            $pdf->writeHTMLCell(80, '', $x, $y, $html, 0, 0, false, true, 'J', true);
             $tablenum++;
            $rownum = 0;
            if($tablenum >= 2 && $tablenum%2 == 0 && $count < $datasize)
            {
                $pdf->AddPage();
                $perpage = 32;         
                $y = $pdf->getY()+5;
            }
            $html = '<table align="center" border="1" cellpadding="1" ><tr><th align="center" width="180">กม.</th><th align="center" width="120">'.$infotype.' (ม./กม.)</th></tr>';
        }  
    }
}

//--------------------------------------------------------------------
// ===== of HDM4
else 
{
    // add a page
    $pdf->AddPage();

    $pdf->Ln(4);

    // set font
    $pdf->SetFont('thsarabun', '', 24);
    $pdf->writeHTML("<b>แผนการซ่อมบำรุง</b>", true, false, true, false, '');

    // set font
    $pdf->SetFont('thsarabun', '', 16);

    $html = 
    '<table border="0" cellpadding="1">
        <tr style="line-height:4px;">
            <td width="130"><b>สายทาง</b></td>
            <td width="10">:</td>
            <td align="left" width="400">'.$expressway.'</td>
        </tr>
        <tr style="line-height:4px;">
            <td width="130"><b>ปี</b></td>
            <td width="10">:</td>
            <td align="left" width="400">'.$year.'</td>
        </tr>
        <tr style="line-height:4px;">
            <td width="130"><b>ประเภทงบประมาณ</b></td>
            <td width="10">:</td>
            <td align="left" width="400">'.$hdm4type.'</td>
        </tr>';

    $pdf->writeHTML($html, true, false, true, false, '');
    $pdf->writeHTML($totalcost, true, false, true, false, '');

     // ----- Add Table Data -----
    $datasize = sizeof($hdm4data);
    $count = 0;
    $tablenum = 0;
    $perpage = 24;
    $rownum = 0;
    $x = $pdf->getX();
    $y = $pdf->getY();
    if($year == "ทุกปี")
        $tableheader = '<table cellpadding="1" border="1"><tr style="background-color: rgb(215, 215, 215);"><th align="center" width="37">ลำดับ</th><th align="center" width="41">ปี</th><th align="center" width="65">กม.เริ่มต้น</th><th align="center" width="65">กม.สิ้นสุด</th><th align="center" width="55">ทิศทาง</th><th align="center" width="65">ช่องจราจร</th><th align="center" width="198">ลักษณะการซ่อม</th><th align="center" width="60">ราคา(ลบ.)</th><th width="60" align="center">NPV</th></tr>';
    else
        $tableheader = '<table cellpadding="1" border="1"><tr style="background-color: rgb(215, 215, 215);"><th align="center" width="47">ลำดับที่</th><th align="center" width="70">กม.เริ่มต้น</th><th align="center" width="70">กม.สิ้นสุด</th><th align="center" width="55">ทิศทาง</th><th align="center" width="70">ช่องจราจร</th><th align="center" width="208">ลักษณะการซ่อม</th><th align="center" width="65">ราคา(ลบ.)</th><th width="60" align="center">NPV</th></tr>';


/*
if(hdm4_cond == "RM00") {
					region = 0;
			} else if(hdm4_cond == "SS02") {
					region = 1;
			} else if(hdm4_cond == "RP05") {
					region = 2;
			} else if(hdm4_cond == "RP04") {
					region = 3;
			} else if(hdm4_cond == "RP08") {
					region = 4;
			}
*/

    $html = $tableheader;
    while($count <= $datasize)
    {
        if($count%2 == 0)
            $html .= '<tr>';
        else
            $html .= '<tr style="background-color: rgb(245, 245, 245);">';

        $html .= '<td align="center">'.($count+1).'</td>';
        if($year == "ทุกปี")
            $html .= '<td align="center">'.($hdm4data[$count][0]+543).'</td>';
        $html .= '<td align="center"> '.$hdm4data[$count][1].'</td>';
        $html .= '<td align="center"> '.$hdm4data[$count][2].'</td>';
        $html .= '<td align="center">'.$hdm4data[$count][3].'</td>';
        $html .= '<td align="center"> '.$hdm4data[$count][4].'</td>';
        if(substr($hdm4data[$count][5],0,4) == "RM00")
        	$html .= '<td align="center" style="background-color: #c6efce;color:#006100"> '.$hdm4data[$count][5].'</td>';
        else if(substr($hdm4data[$count][5],0,4) == "SS02")
        	$html .= '<td align="center" style="background-color: #ffeb9c;color:#8e5c00"> '.$hdm4data[$count][5].'</td>';
        else if(substr($hdm4data[$count][5],0,4) == "RP05")
        	$html .= '<td align="center" style="background-color: #ffc7ce;color:#a41118"> '.$hdm4data[$count][5].'</td>';
        else if(substr($hdm4data[$count][5],0,4) == "RP04")
        	$html .= '<td align="center" style="background-color: #4f81bd;color:#fff"> '.$hdm4data[$count][5].'</td>';
        else if(substr($hdm4data[$count][5],0,4) == "RP08")
        	$html .= '<td align="center" style="background-color: #c0504d;color:#fff"> '.$hdm4data[$count][5].'</td>';
        else 
        	$html .= '<td align="center"> '.$hdm4data[$count][5].'</td>';
        $html .= '<td align="center">'.$hdm4data[$count][6].'</td>';
        $html .= '<td align="center">'.$hdm4data[$count][7].'</td>';
        $html .= '</tr>';

        $rownum++;
        $count++;

        if($rownum == $perpage || $count == $datasize)
        {     
            $html .= '</table>';
            $x = $pdf->getX();
           // if($tablenum%2 == 1)
           //     $x += 15;
            $pdf->writeHTMLCell(80, '', $x, $y, $html, 0, 0, false, true, 'J', true);
            //$tablenum++;
            $rownum = 0;
            if($count < $datasize)
            { 
                $pdf->AddPage();
                $perpage = 30;         
                $y = $pdf->getY()+5;
            }
            $html = $tableheader;
        }  

    }
}

// --------------------------------------------------------

//Define filename
$datecrated = date("Ymd");   
if($pdftype == "damage")
{
    $info = substr($infotype,strrpos($infotype,"-")+1);
    $filename = $datecrated.' -'.$info.' - '.$code;
}
else
{
    $filename = $datecrated.'- HDM4result - '.$year;
}
//Close and output PDF document

$pdf->Output("pdftemp.pdf", 'F');


//Function
function pxToMm($px){
    $mm = ($px * 2.54 / 96.0) * 10;
    return $mm;
}


?>

