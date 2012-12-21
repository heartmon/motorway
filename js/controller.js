$(function () {

});

//
function Controller(){

	//Public Function
	this.damageSearch = function(){

		g_hdm4search_click = false;
		var kmstart = $('#fix_range input[name=kmstart]').val();
		var kmend   = $('#fix_range input[name=kmend]').val();
        var infotype = $('#toolbox input[name=infotype]:checked').val();
        //g_search_info.infotype = $('#toolbox input[name=infotype]:checked').val();
		if(_formValidation(kmstart,kmend,infotype))
		{
			$('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css('border', '').css('background-color', '');
			g_search_info.expressway = $('#toolbox select[name=expressway]').val();

            g_search_info.infotype = $('#toolbox input[name=infotype]:checked').val();
            g_search_info['exptype'] = $('#toolbox select[name=exptype]').val();
          //  if( g_search_info['exptype'] == 1) {
                g_search_info.kmstart = kmstart;
                g_search_info.kmend = kmend;
           // }


           /* if ($("#option2").is(":visible")) {
                var exptype = $('select[name=exptype]').val();
	            if ($('select[name=exptype]').val() == "2") {
	                var sectionCode = $('.enexname:visible').val();
	               // g_search_info_level2['currentcode'] = $('select.enexname:visible').find('option:selected').html();
	            } else {
	                var sectionCode = $('#toolbox .accessname').val();
	                //g_search_info_level2['currentcode'] = $('select.accessname:visible').find('option:selected').html();
	            }
	        }*/

       		console.log(g_search_info);
       		_setupVar();
            switch(g_search_info['exptype'])
           {
            case "1":
                var sectionCode = $('select.mainsection:visible').val();
                g_search_info_level2.currentsection = sectionCode;
                g_search_info_level2.currentsection = _formSection(g_search_info.expressway,sectionCode,g_search_info.exptype,'F1');
                g_search_info_level2.currentcode = $('.mainsection:visible option[value='+sectionCode+']').html();
                break;
            case "2":
                var sectionCode = $('.enexname:visible').val();
                g_search_info_level2.currentsection = _formSection(g_search_info.expressway,sectionCode,g_search_info.exptype,'F1');
                g_search_info_level2.currentcode = $('.enexname:visible option[value='+sectionCode+']').html();
                break;
            case "3":
                var sectionCode = $('.accessname:visible').val();
                g_search_info_level2.currentsection = _formSection(g_search_info.expressway,sectionCode,g_search_info.exptype,'F1');
                g_search_info_level2.currentcode = $('.accessname:visible option[value='+sectionCode+']').html();
                break;
            case "4":
                var sectionCode = $('.intersect:visible').val();
                //var lanecode = sectionCode.slice(-2);
                g_search_info_level2.currentsection = _formSection(g_search_info.expressway,sectionCode,g_search_info.exptype,'');
                g_search_info_level2.currentcode = $('.intersect:visible option[value='+sectionCode+']').html();
                break;
           }
           g_search_info_level2['kmstart'] = g_search_info['kmstart'];
            g_search_info_level2['kmend'] = g_search_info['kmend'];
           // $('#pavement').remove();
            if(g_search_info.infotype != "pavement")
            {
                console.log(sectionCode)
                this.searchBySectionName(sectionCode);
               
            }
            else
            {
                g_search_info_level2['kmstart'] = '';
                g_search_info_level2['kmend'] = '';
                g_all_result_all_lane = {};
                g_all_result = {};

                $("#video-map-display").hide();

                $('#pavement_lane').html('');
                if(g_search_info['exptype'] == "1" || g_search_info['exptype'] == "3")
                {
                    $('#pavement_lane').html('');
                    _showLane($('#pavement_lane'), _sectionException(sectionCode));
                    $('#pavement_lane').prepend('<b>เลน:</b> ');
                    $('#pavement_lane #mainLane').addClass('span1').removeClass('span3');
                }
                this.searchPavement(sectionCode);
            }

		}
	}


    this.searchPavement = function(sectionCode){
        model.getPavement();
        showdata($("#pavement"));
    }

    this.setupPavement = function(data){

        var headers = {'ตอนควบคุม: ': g_search_info_level2.currentcode+' ('+g_search_info_level2.currentsection+')', 'สายทาง: ':toExpressName(g_search_info.expressway)};
        var columns = ['ระยะทาง','Lat','Long','รอยแตกหนังจระเข้','รอยแตกตามยาว','รอยร่องล้อ','ผิวหลุดร่อน','หลุม บ่อ','ผิวยุบตัวเป็นแอ่ง','ปะซ่อมผิว'];
        view.createPavement(data,headers);
        //$('#pavement').show();
        showdata($('#pavement'));
        qtip.removeAllFeatures();
        qtipPavement.removeAllFeatures();
        addPointsPavement(g_pavement);
        zoomCoor();
        var text = g_search_info_level2.currentcode + ' ' ;
        if(g_search_info.exptype == 1 || g_search_info.exptype == 3)
            text +=  toDir(g_search_info_level2['currentsection'].slice(-2))+' เลน '+g_search_info_level2['currentsection'].slice(-2);
        updateBreadCrumb(expcodeToExpressway(g_search_info.expressway),text,$('input[name=infotype][value='+g_search_info.infotype+']').next().html(),'');
    }

	this.searchBySectionName = function(sectionCode) {
        
        zoom = false;
        if(g_search_info_level2['currentsection'].indexOf('0000') == -1)
        {
            zoomCoor();
            zoom = true;
        }
        g_all_result_all_lane = {};
        console.log(sectionCode);
        $('#lane_selection').html('');
        $('#maptoolbox #mainLane').remove();
        
        if ($('#lane_selection').is(':hidden')) $('#lane_selection').show();
        if (g_search_info['exptype'] == "2") {    
            cloneToMap($("#toolbox .enexname:visible"), '#lane_selection');       
            this.getAllLane(false);
        } else if (g_search_info['exptype'] == "3") {
            // console.log($('#lane_selection select.accessname'));
            //if($('#lane_selection select.accessname'))
                cloneToMap($("#toolbox select.accessname:visible"), '#lane_selection', false, false);
            _showLane($('#lane_selection'), _sectionException(sectionCode));
            cloneToMap($("#lane_selection #mainLane"), '#maptoolbox #selectname', false, false);
            //cloneToMap($("#maptoolbox #mainLane"), '#lane_selection', false, false);
            $('#lane_selection .accessname').addClass('span2').removeClass('span3');
            $('#lane_selection #mainLane option:first').prop('selected', 'selected');
            $('#lane_selection #mainLane').addClass('span1').removeClass('span3');
            $('#lane_selection .mainsection').addClass('span2').removeClass('span3');
            $('#maptoolbox #mainLane option:first').prop('selected', 'selected');
            $('#maptoolbox #mainLane').prop('multiple', 'multiple');
            
            this.getAllLane(true);
        } else if (g_search_info['exptype'] == "4") {
            
            
            cloneToMap($("#toolbox .intersect:visible"), '#lane_selection');
            
            this.getAllLane(false);
        } 
        else {
            cloneToMap($("#toolbox select.mainsection:visible"), '#lane_selection', false, false);
            _showLane($('#lane_selection'), _sectionException(sectionCode));
            cloneToMap($("#lane_selection #mainLane"), '#maptoolbox #selectname', false, false);
         //   cloneToMap($("#maptoolbox #mainLane"), '#lane_selection', false, false);
            $('#lane_selection #mainLane option:first').prop('selected', 'selected');
            $('#lane_selection #mainLane').addClass('span1').removeClass('span3');

            $('#lane_selection .mainsection').addClass('span2').removeClass('span3');
            
            $('#maptoolbox #mainLane option:first').prop('selected', 'selected');

            $('#maptoolbox #mainLane').prop('multiple', 'multiple');


          //  g_search_info_level2['currentsection'] = $('#lane_selection select.mainLane :selected').val();
          //  g_search_info_level2['currentcode'] = $('#lane_selection select.mainLane :selected').prop('title');
         //   console.log(g_search_info_level2);
            this.getAllLane(true);
        }
    }

	 //Get data of all lane in one time
     this.getAllLane = function (all, isHDM4) {
        showLoading();
        // if (!isHDM4) {
             
        //     var section = g_search_info_level2.currentsection;
        // } else 
        //if(g_hdm4search_click)
         //   var section = g_hdm4_search['section'];
        //else
            var section = g_search_info_level2.currentsection;

        var suffix = [];
        if (all) {
            $('#lane_selection #mainLane option').each(function () {
                var s = $(this).val().slice(-2);
                suffix.push(s);
            });
        } else {
            suffix.push(section.slice(-2));
        }
      //  console.log(suffix);
        //if(g_search_info.exptype == "1" && g_search_info_level2.currentsection == '0000')
           // var prefix = ''// var prefix = g_search_info.expressway+'%';
        if (section.indexOf('R') != -1) 
            var prefix = section.substr(0, section.indexOf('R'));
        else 
            var prefix = section.substr(0, section.indexOf('F'));
        //console.log(prefix);

        var fingetalllane = false;
        if(!g_all_result_all_lane[suffix[0]])
        {
            model.getAllDamageInfo(g_search_info.infotype,25,prefix+suffix[0],g_search_info.exptype,$('select#hdm4type').val(),$('input[name=hdm4year]:checked').val(),true);
        }
        for (var i = 1; i < suffix.length; i++) {
            var isection = prefix + suffix[i];
            var c = 0;
            if (!g_all_result_all_lane[suffix[i]]) {
                 model.getAllDamageInfo(g_search_info.infotype,25,isection,g_search_info.exptype,$('select#hdm4type').val(),$('input[name=hdm4year]:checked').val());
            }
        }
    }

    this.setAllResult = function(data) {
        var s = data[0]['section'].slice(-2);
        g_all_result_all_lane[s] = data;
        g_all_result_all_lane[s]['offset'] = g_all_result_all_lane[s]['rangefix'] / 25;
        //var maxdis = parseFloat(g_all_result_all_lane[s][g_all_result_all_lane[s]['indexsearch']]['subdistance']) + g_all_result_all_lane[s]['rangefix'] / 1000;
        var maxdis = parseFloat(g_all_result_all_lane[s][g_all_result_all_lane[s]['num_rows']-1]['subdistance']) + g_all_result_all_lane[s]['rangefix'] / 1000;
        if (maxdis > parseFloat(g_all_result_all_lane[s]['lastkm']))
             maxdis = g_all_result_all_lane[s]['lastkm'];
        g_all_result_all_lane[s]['maxdis'] = parseFloat(maxdis);
        g_all_result_all_lane[s]['mindis'] = parseFloat(g_all_result_all_lane[s][0]['subdistance']);
        g_all_result_all_lane[s]['usedlength'] = Math.ceil((g_all_result_all_lane[s]['maxdis'] * 1000 - g_all_result_all_lane[s]['mindis'] * 1000) / 25);
        g_all_result_all_lane[s]['onmap'] = false;
        //if(g_hdm4search_click)
        //    this.

    }

    //Show Data(table graph) of activated lane
    this.activatedResult = function (data, isHDM4) {
        if (!g_hdm4search_click) {
             showdata($("#damagesearch"));
            //this.showdata($("#damagesearch"));
            // if ($('#main_content').is(':hidden')) {
            //     $('#main_content').show();
            // }
            //if ($('#damagesearch').is(':hidden')) 
            //    showDamage();
            _rangefix = data['rangefix'];
            if (!g_search_info_level2.kmfreq) 
                g_search_info_level2.kmfreq = _rangefix;
            disableFreq();
            //g_search_info_level2['kmstart'] = g_search_info['kmstart'];
            //g_search_info_level2['kmend'] = g_search_info['kmend'];
        }
        g_all_result = data;

        g_search_info_level2.currentsection = g_all_result[0]['section'];
        if(g_hdm4search_click)
            zoom = false;
        if(!zoom)
        {
            zoomCoor();
            zoom = true;
        }
        if (g_search_info_level2['currentsection'].indexOf('R') != -1) {
            reverse = true;
        } 
        else 
            reverse = false;

        if (g_search_info_level2['kmend'] > parseFloat(g_all_result['lastkm']) || !g_search_info_level2['kmend']) 
            g_search_info_level2['kmend'] = parseFloat(g_all_result['lastkm']);
        if (!g_search_info_level2['kmstart']) 
            g_search_info_level2['kmstart'] = parseFloat(g_all_result[0]['subdistance']);

        //if(!g_hdm4search_click)
            this.calculatePlotData(isHDM4);
    }

     //Calculate Data based on KM Frequency
    this.calculatePlotData = function (isHDM4) {
        //Reset
        //alert('set');
        g_linedata = [];

        var count = 0;
        var index_freq = g_search_info_level2.kmfreq / 25;
        var kmfreq = g_search_info_level2.kmfreq;
        var sum = {
            iri_avg: 0,
            rut_lane: 0,
            mpd: 0
        };
        var dataInSum = 0;
        var ymax = 0;
        var maxdis = 0;
        var num_rows = g_all_result['num_rows'];
        var sub = Math.ceil((parseFloat(g_all_result[num_rows - 1]['subdistance']) * 1000 - g_search_info_level2['kmend'] * 1000) / 25);
        var last_consider_row = num_rows;
        var endbound = false;
        var infotype = getInfoType(g_search_info.infotype);
        if (sub > 0) {
            last_consider_row = num_rows - sub + index_freq;
            if (last_consider_row > num_rows) last_consider_row = num_rows;
        }
        if (last_consider_row == num_rows) var endbound = true;

        for (var row = 0; row < last_consider_row; row++) {
            var temp;
            if (kmfreq != 25) {
                if (count % index_freq == 0 && parseFloat(g_all_result[row]['subdistance']) <= g_search_info_level2['kmend']) {
                    //console.log(g_all_result[row]['subdistance']);
                    temp = g_all_result[row]['subdistance'];
                    //console.log("temp:"+temp);
                }

                sum['iri_avg'] += parseFloat(g_all_result[row]['iri_avg']);
                sum['rut_lane'] += parseFloat(g_all_result[row]['rut_lane']);
                sum['mpd'] += parseFloat(g_all_result[row]['mpd']);
                dataInSum++;
                count++;
                if ((count % index_freq == 0 || ((count == last_consider_row) && endbound)) && temp) {  
                    var new_avg = (sum[infotype] * 1.0 / dataInSum).toFixed(4);
                    //console.log("avg:"+new_avg);
                    g_linedata.push([temp, new_avg]);
                    var sum = {
                        iri_avg: 0,
                        rut_lane: 0,
                        mpd: 0
                    };
                    dataInSum = 0;

                    if (ymax < new_avg) ymax = new_avg;
                    temp = 0;
                    if (count == last_consider_row) maxdis = g_all_result[row]['subdistance'];
                    else maxdis = g_all_result[row + 1]['subdistance'];
                }
            } else {
                count++;
                if (count != last_consider_row || endbound) {
                    g_linedata.push([g_all_result[row]['subdistance'], parseFloat(g_all_result[row][infotype]).toFixed(4)]);
                    maxdis = g_all_result[row]['subdistance'];
                } else maxdis = g_all_result[row]['subdistance'];

                if (ymax < parseFloat(g_all_result[row][infotype])) ymax = g_all_result[row][infotype];
            }
        }
        g_all_result['ymax'] = ymax;
        g_all_result['mindis'] = parseFloat(g_all_result[0]['subdistance']);
        g_all_result['maxdis'] = parseFloat(maxdis);
        g_all_result['offset'] = index_freq;
        g_all_result['last_consider_row'] = last_consider_row;
        g_all_result['usedlength'] = Math.ceil(Math.round((g_all_result['maxdis'] * 1000 - g_all_result['mindis'] * 1000)) / 25);
        //console.log(g_all_result['usedlength']);
       // g_all_result['indexsearch'] = g_all_result['usedlength']

//        g_data['kmstart'] = g_all_result['mindis'];
  //      g_data['kmend']   = g_all_result['maxdis'];

        qtip.removeAllFeatures();

        addPoints(g_all_result);

        //Reset Some Value          
        selectedIndex = -1;

        g_current_var = {
            index: 0,
            kmstart: 0,
            kmend: 0,
            section: "",
            rangekmstart: 0,
            rangekmend: 0,
            lat: 0,
            longi: 0,
            mpd: 0,
            iri_avg: 0,
            rut_lane: 0,
            hdm4: ""
        };
        setUpCurrentVar();

        //If Damage Search then create slider, chart, datatable and image thumbnail
       if (!g_hdm4search_click) {
            
            $('#current_linedata').hide();
            setStartEndIndex(0, g_linedata.length - 1);
            view.createSlider('slider-range', 'range');
            _createGraph();
            view.createDataTable();
            
            var text = g_search_info_level2.currentcode + ' ' ;
            if(g_search_info.exptype == 1 || g_search_info.exptype == 3)
                text +=  toDir(g_search_info_level2['currentsection'].slice(-2))+' เลน '+g_search_info_level2['currentsection'].slice(-2);
            updateBreadCrumb(expcodeToExpressway(g_search_info.expressway),text,$('input[name=infotype][value='+g_search_info.infotype+']').next().html(),toKm(g_search_info_level2.kmstart) + ' - ' + toKm(g_search_info_level2.kmend));
           // $('.fullname').html(text);
            hideLoading();

            this.settingImage();


            //if(g_search_info_level2['kmfreq'] > 100 && Math.ceil(g_all_result['usedlength']/(g_search_info_level2['kmfreq']/5)) <= 20)
            //  reelSetup();
       }

        //Set Video Length
        // if (isHDM4) 
        //     g_video['length'] = g_all_result['usedlength'] - 1;
        // else if (!reverse) 
        //     g_video['length'] = g_all_result['usedlength'];
        // else 
             g_video['length'] = g_all_result['usedlength'] + 1;

        // //Get First Image and Preloaded Video
        // if (!g_video['first_image']) 
             model.getFirstImage(g_search_info_level2.currentsection);
       //  else {
             // if ($('#videoplayer').find('div').hasClass('jsMovieFrame')) 
             //     $('#videoplayer').jsMovie("destroy");
             // $('#videoplayer').data("loadStatus", 'loaded');

             // openVideo();
             // videoPreloader();

             // if (!isHDM4) {
             //     $('#table1 tr').eq(0).click();
       //      }
       //  }
       if(g_hdm4search_click)
            updateCurrentVar(0);
        hideLoading();
    }    
    this.videoInit = function(){
        //Initialize and Setup video
        if ($('#videoplayer').find('div').hasClass('jsMovieFrame')) 
            $('#videoplayer').jsMovie("destroy");
        $('#videoplayer').data("loadStatus", 'loaded');

      //  Preload video
       openVideo();
       videoPreloader();

       if (!g_hdm4search_click) {
            $('#table1 tr').eq(0).click();
            scrollTable();
        }
        //else
    }
    this.settingImage =  function() {
        $('#video-detail .control-section').html(g_all_result[0]['section']);
        $('#video-detail .code-section').html(g_search_info_level2.currentcode);
        $('#video-detail .kmstart').html(g_search_info.kmstart);
        $('#video-detail .kmend').html(g_search_info.kmend);
        $('#video-detail .selectedkm').html('');
        $('#video-detail .latitute').html('');
        $('#video-detail .longtitute').html('');
        $('#video-player #thumbnail').html('').show();
        $('#video-player #reel_container').hide().html('');
    }

    this.exportPDFPavement = function(){
        var data = {
                pdftype:"pavement",
                 columns: view.getPavementColumns(),
                cWidth: view.getPavementColumnsWidth(),
                expressway: toExpressName(g_search_info.expressway),
                section: g_search_info_level2.currentsection,
                code: g_search_info_level2.currentcode,
                data: g_pavement_array
            };
        // var divide = 100;
        // var l = Math.ceil(g_pavement_array.length/divide);
        // var datacut = [];
        // var temp = g_pavement_array;
        // for(var i=0; i<l; i++)
        //     {
        //     datacut.push(temp.slice(i*divide,i*divide+divide-1));

        //     console.log(datacut);
        // }
        // for(var i = 0; i<datacut.length; i++)
        // {
        //     data['data'+i] = datacut[i];
        // }
        // data['len'] = l;
        // console.log(data);
        showLoading();
        $.ajax({
            url: 'ajax/_export_pdf.php',
            type: 'POST',
            data: data,
            success: function (data) {
                if (!data['error']) {
                    //alert('pdf saved');
                  //  alert(data);
                   $("#genpdf:visible").submit();
                   // alert(data);
                } else {
                    alert('Search not found');
                }
                hideLoading();
            }
        });
        return false;
    }

    this.exportPDFhdm4 = function() {
        //Prepare data
        var year = $("#hdm4result .hdm4year").html();
        var expressway = $('#hdm4result .expressway').html() + ' / ' + $('#hdm4result .section').html();
        var hdm4type = $("#hdm4result .hdm4type").html();
        var totalcost = $("#totalcost").html();
        //Retrieve data from table
        showLoading();
        $.ajax({
            url: 'ajax/_export_pdf.php',
            type: 'POST',
            data: {
                expressway: expressway,
                year: year,
                pdftype: "hdm4",
                hdm4type: hdm4type,
                totalcost: totalcost,
                hdm4data: g_hdm4_data_result
            },
            success: function (data) {
                if (!data['error']) {
                    //alert('pdf saved');
                    $("#genpdf").submit();
                } else {
                    alert('Search not found');
                }
                hideLoading();
            }
        });
        return false;
    }

    this.exportPDF = function () {
        //Prepare data
        var expressway = $("#search-input .expressway").html();
        var infotype = $('input[name=infotype][value='+g_search_info['infotype']+']').next().html();
        var currentsection = g_search_info_level2['currentsection'];
        var currentcode = g_search_info_level2['currentcode'];
        var fullName = toFullName(currentcode);
        var kmrange = $("#search-input .rangekm").html();
        var kmfreq = g_search_info_level2['kmfreq'];

        try {
            var currentImage = g_imageset[selectedIndex * g_search_info_level2.kmfreq / 5]['filename'];
            var currentkm = $("#table1 tr").eq(selectedIndex).find('td').eq(0).html();
            var currentlat = g_all_result[(selectedIndex) * g_all_result['offset']]['lat'];
            var currentlong = g_all_result[(selectedIndex) * g_all_result['offset']]['long'];
        } catch (err) {
    
        }

        var yaxis = [];
        var ygridpx = "";
        $("div.yAxis .tickLabel").each(function (index) {
            yaxis.push($(this).html());
            if (!ygridpx) {
                var s1 = $("div.yAxis .tickLabel").eq(index).css('top');
                var a1 = s1.substr(0, s1.indexOf("px"));
                var s2 = $("div.yAxis .tickLabel").eq(index + 1).css('top');
                var a2 = s2.substr(0, s2.indexOf("px"));
                a1 = parseFloat(a1.replace("+", "."));
                a2 = parseFloat(a2.replace("+", "."));
                ygridpx = Math.abs(a2 - a1);
            }
        });

        var xaxis = [];
        var xgridpx = "";
        $("div.xAxis .tickLabel").each(function (index) {
            xaxis.push($(this).html());
            if (!xgridpx) {
                xgridpx = [];
                var s1 = $("div.xAxis .tickLabel").eq(index).css('left');
                var a1 = s1.substr(0, s1.indexOf("px"));
                var s2 = $("div.xAxis .tickLabel").eq(index + 1).css('left');
                var a2 = s2.substr(0, s2.indexOf("px"));
                a1 = parseFloat(a1.replace("+", "."));
                a2 = parseFloat(a2.replace("+", "."));
                xgridpx.push(a1);
                xgridpx.push(a2);
            }
        });

        var tabledata = [];
        var tempindex = selectedIndex;
        selectedIndex = -1;
        view.drawGraph();

        var canvasData = chartCanvas.toDataURL("image/jpg");

        //Retrieve data from table
        for (var i = startIndex; i <= endIndex; i++) {
            var temp = [];
            $("#table1 tbody tr").eq(i).find('td').each(function (index) {
                temp.push($(this).html());
            });
            tabledata.push(temp);
        }

        var data_inrange = tabledata;
        showLoading();
        $.ajax({
            url: 'ajax/_export_pdf.php',
            type: 'POST',
            data: {
                expressway: expressway,
                infotype: infotype,
                section: currentsection,
                code: currentcode,
                fullname: fullName,
                kmrange: kmrange,
                kmfreq: kmfreq,
                data_inrange: data_inrange,
                canvasData: canvasData,
                yaxis: yaxis,
                ygridpx: ygridpx,
                xaxis: xaxis,
                xgridpx: xgridpx,
                currentImage: currentImage,
                currentlong: currentlong,
                currentlat: currentlat,
                currentkm: currentkm,
                pdftype: "damage"
            },
            success: function (data) {
                console.log(data);
                if (!data['error']) {
                    $("#genpdf").submit();
                    if (tempindex >= 0) updateVertical(tempindex);
                } else {
                    errorReport('ไม่สามารถสร้าง pdf ได้');
                }
                hideLoading();
            }
        });
        return false;
    }

    //======================== HDM4 Function =============================//

    this.hdm4Click = function(kmstart, kmend, section) {
        _setupVar();
        //showLoading();
        console.log('kmstart: '+kmstart);
        console.log('kmend: ' + kmend);
        g_search_info_level2['kmstart'] = kmstart;
        g_search_info_level2['kmend'] = kmend;
        g_search_info['infotype'] = "roughness";

        g_search_info_level2['currentsection']    =   section;
        //console.log(section);
        //g_hdm4_search['section'] = section;
        g_search_info['exptype'] = g_hdm4_search['exptype'];
        g_search_info_level2.kmfreq = 25;

        g_data['kmstart'] = kmstart;
        g_data['kmend'] = kmend;

        // console.log(g_search_info_level2);
        zoomCoor();
        //ajaxSearch1(true);
        g_all_result_all_lane = {};
        this.getAllLane(false);
    }

    this.hdm4Search = function() {
        g_hdm4search_click = true;
        //setupLevel2();
        //g_video = {};
        //finish_getimage = false;
        var valid = true;
        //Form Validation
        var temp_ex = $('select[name=expressway]').val();
        var exptype = $('select[name=exptype]').val();

        if (exptype == "1")
        {
            g_hdm4_search['section'] = temp_ex+$('#pavement_select select[name=mainsection'+temp_ex+']').find('option').first().val()+'M00';
            g_hdm4_search['code'] = $('#pavement_select select[name=mainsection'+temp_ex+']').find('option').first().html();
        }
        else
        {
            g_hdm4_search['section'] = temp_ex+$('#toolbox select.seclist:visible').find('option:selected').first().val().substr(0,7);
            g_hdm4_search['code'] = $('#toolbox select.seclist:visible').find('option').first().html(); 
        }
        
        //For ENEX and ACCESS Type
        // if (exptype == "3") //Access
        // {

        //     temp_ex = $('#toolbox select.accessname').val().substr(0, $('select.enexname').val().length - 3);
        //     //Order for dropdown
        //     g_hdm4_search['dropdownOrder'] = $('#toolbox #accessname option:selected').index();
        // } else if (exptype == "2") //Enex
        // {
        //     temp_ex = $('select.enexname').val().substr(0, $('select.enexname').val().length - 3);
        //     //Order for dropdown
        //     g_hdm4_search['dropdownOrder'] = $('#toolbox .enexname:visible option:selected').index();
        // }


        if (temp_ex == "nothing") {
            alert('โปรดเลือกสายทาง');
            valid = false;
        }
        if (valid) {
            //SetUp Value
            g_hdm4_search['expressway'] = temp_ex;
            //g_search_info['expressway'] = $('select[name=expressway]').val();
            g_hdm4_search['type'] = $('#hdm4type').val();
            var temp = $('input:radio[name=hdm4year]:checked').val();
            g_hdm4_search['year'] = temp;
            g_hdm4_search['prevyear'] = temp;
            g_hdm4_search['exptype'] = exptype;

            //GET HDM4 Data Result
            model.getHDM4Result(g_hdm4_search['expressway'],g_hdm4_search['type'],g_hdm4_search['year'],g_hdm4_search['exptype'],g_hdm4_search['section']);
        }
        return false;
    }

    

    this.setHDM4 = function(){
        g_hdm4_search['section'] = g_hdm4_result[0]['section'].substr(0,9);
        view.updateHDM4metadata();
        view.createHDM4table(g_hdm4_result, totalcost);
        var text = g_hdm4_search['code'] + ' ' ;
        updateBreadCrumb(expcodeToExpressway(g_hdm4_search.expressway),text,'แผนการซ่อมบำรุง: '+$('#hdm4result .hdm4type').html(),'');
    }

    //====== GEOLOCATION ACTION
    this.getGeolocation = function(lat,longitude){
        //alert(lat);
        //alert(longitude);

        lat = 13.7374042;
        longitude =100.6610667;
        g_geolocation['lat'] = lat;
        g_geolocation['longitude'] = longitude;
        //lat = 13.7304618;
        //longitude = 100.7608799;

        if($('#toolbox input[name=infotype]:checked').val() == "pavement")
        {
            model.getNearestPavement(lat,longitude,"F1",true);
            model.getNearestPavement(lat,longitude,"F2");
            model.getNearestPavement(lat,longitude,"F3");
            model.getNearestPavement(lat,longitude,"F4");
            model.getNearestPavement(lat,longitude,"R1");
            model.getNearestPavement(lat,longitude,"R2");
            model.getNearestPavement(lat,longitude,"R3");
            model.getNearestPavement(lat,longitude,"R4");
        }
        else
        {
            model.getNearest(lat,longitude,"F1",true);
            model.getNearest(lat,longitude,"F2");
            model.getNearest(lat,longitude,"F3");
            model.getNearest(lat,longitude,"F4");
            model.getNearest(lat,longitude,"R1");
            model.getNearest(lat,longitude,"R2");
            model.getNearest(lat,longitude,"R3");
            model.getNearest(lat,longitude,"R4");
        }
        


        $('#maptoolbox #geo').html('');
        $('#maptoolbox #geo').show();
        $('#maptoolbox #mainLane').hide();
        _showLane($('#maptoolbox #geo'), _sectionException());
        $('#maptoolbox #geo select').prop('id','geomainLane');
        $('#maptoolbox #geo select').prop('class','geomainLane');
        $('#maptoolbox #geo select').prop('multiple', 'multiple');
        $('#maptoolbox #geo select option:first').prop('selected', 'selected');
         
    }

    this.setNearestOnMap = function(current){
        qtip.removeAllFeatures();
        qtipPavement.removeAllFeatures();
        if(current){
            addPoints(current);
        }
    }

	//Private Function
    _showLane = function(selector,n){
        //selector = $('select[name=mainLane]');
        //selector.find('option').show();
        var htmlcode = '<select id="mainLane" name="mainLane" class="mainLane">';
        for(var i=0; i<n; i++)
        {
            if(i<n/2)
                var prefix = 'F';
            else
                var prefix = 'R';
            var suffix = (i%(n/2))+1;
            var val = prefix+suffix;
            htmlcode += '<option value="'+val+'">'+val+'</option>';
        }
        htmlcode += '</select>';
        selector.append(htmlcode);
    }

    _sectionException = function(section){
        switch(section){
            //2 lane
            case "0102":
                return 2;
            //4 lane
            case "0402B01":
            case "0500B01":
            case "0500B03":
            case "0500B04":
            case "0302":
            case "0402B02":
            case "0500B02":
                return 4;
            default:
                return 8;
        }
    }

    _someFunc = function (ctx, x, y, radius, shadow) {
        _someFunc.calls++;
        ctx.arc(x, y, radius / 3, 0, shadow ? Math.PI : Math.PI * 2, false);
    }
    _someFunc.calls = 0;

 

     //Set graph option
    _createGraph =  function () {
        //Setting max
        var ymax = parseInt(g_all_result['ymax']);
        if (ymax <= 3) var max = ymax * 2;
        else var max = ymax + 4;
        g_options = {
            series: {
                lines: {
                    show: true,
                    lineWidth: 2
                },
                points: {
                    show: false,
                    symbol: _someFunc
                }
            },
            xaxis: {
                min: g_data['kmstart'],
                max: g_data['kmend'],
                tickFormatter: toKm
            },
            yaxis: {
                min: 0,
                max: max
            },
            // grid: { clickable: true},    
            grid: {
                clickable: true,
                canvasText: {
                    show: true,
                    font: "sans 9px"
                }
            },
            legend: {
                position: 'nw',
                backgroundOpacity: 0
            }
        };
        //Draw
        view.drawGraph();
    }

    _formSection = function(exp, section, exptype,dirlane){
        var type = "";
        switch(exptype){
            case "1":
                type = "M00";
                break;
            case "2":
                //
                break;
            case "3":
               //
                break;
            case "4":
                break;
        }

        return exp+section+type+dirlane;
    }
	_setupVar = function(){
	//	$("#videopreloader div.bar").css('width', '');
     //   $("#videopreloader .percentage").html('');
     //   if ($('#videoplayer').find('div').hasClass('jsMovieFrame')) $('#videoplayer').jsMovie("destroy");

        //Setup value used for 2nd level search (not click เรียกดู button)
        g_search_info_level2['kmstart'] = g_search_info.kmstart;
        g_search_info_level2['kmend'] = g_search_info.kmend;

        //Reset
        g_search_info_level2['currentlane'] = '';
        g_search_info_level2['currentsection'] = '';
        g_search_info_level2['kmfreq'] = '';
	}

	_formValidation = function(temp_kms,temp_kme,infotype) {
		//form validation
		var valid = true;
		if($('#fix_range').is(":visible"))
		{
			if (temp_kms != '') {
	            temp_kms = parseFloat(temp_kms.replace('+', '.'));
	            temp_kms = parseFloat(temp_kms.toFixed(3));
	        }
	        if (temp_kme != '') {
	            temp_kme = parseFloat(temp_kme.replace('+', '.'));
	            temp_kme = parseFloat(temp_kme.toFixed(3));
	        }
	        var notvalid = {
	            'border': "1px solid red",
	            'background-color': "#FFD5D5"
	        };
            if($('input[name=infotype]:checked').val() != 'pavement')
            {
    	        if ((temp_kms === '' || temp_kme === '') && valid) {
    	            alert('โปรดกำหนด ช่วง กม.');
    	            valid = false;
    	            $('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css(notvalid);
    	        }
    	        if (isNaN(temp_kms) || isNaN(temp_kme) && valid) {
    	            alert('ช่วง กม. ต้องเป็นตัวเลขเท่านั้น');
    	            valid = false;
    	            $('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css(notvalid);
    	        }
    	        if (temp_kms >= temp_kme && valid && temp_kms !== '' && temp_kme !== '') {
    	            alert('ช่วง กม. เริ่มต้น ต้องน้อยกว่า ช่วง กม. สิ้นสุด');
    	            valid = false;
    	            $('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css(notvalid);
    	        }
    	        if (temp_kme - temp_kms > 2 && valid) {
    	            alert('ระยะทางต้องไม่เกิน 2 กม.');
    	            valid = false;
    	            $('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css(notvalid);
    	        }
                if (infotype == null){
                    alert('yeah');
                }
            }
  		}
        return valid;

	}
}
	
