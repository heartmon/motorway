$(function () {

});

//
function Controller(){

	//Public Function
	this.damageSearch = function(){
		
		var kmstart = $('#fix_range input[name=kmstart]').val();
		var kmend   = $('#fix_range input[name=kmend]').val();
		if(_formValidation(kmstart,kmend))
		{
			$('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css('border', '').css('background-color', '');
			g_search_info.expressway = $('#toolbox select[name=expressway]').val();
            g_search_info.kmstart = kmstart;
            g_search_info.kmend = kmend;
            g_search_info.infotype = $('#toolbox input[name=infotype]:checked').val();
            g_search_info['exptype'] = $('#toolbox select[name=exptype]').val();
            sectionCode = $('#toolbox select[name=mainsection]').val();

            if ($("#option2").is(":visible")) {
	            if ($('#exptype').val() == "2") {
	                var sectionCode = $('#toolbox .enexname').val();
	                g_search_info_level2['currentcode'] = $('select.enexname:visible').find('option:selected').html();
	            } else {
	                var sectionCode = $('#toolbox .accessname').val();
	                g_search_info_level2['currentcode'] = $('select.accessname:visible').find('option:selected').html();
	            }
	        }

       		console.log(g_search_info);
       		_setupVar;

            this.searchBySectionName(sectionCode);
		}
	}

	this.searchBySectionName = function(sectionCode) {
        zoomCoor();
        g_all_result_all_lane = {};
        $('#lane_selection').html('');
        if ($('#lane_selection').is(':hidden')) $('#lane_selection').show();
        if (g_search_info['exptype'] == "2") {
            cloneToMap($("#toolbox .enexname:visible"), '#lane_selection');
            g_search_info_level2['currentsection'] = sectionCode;
            getAllLane(false);
        } else if (g_search_info['exptype'] == "3") {
            cloneToMap($("#toolbox .accessname:visible"), '#lane_selection');
            g_search_info_level2['currentsection'] = sectionCode;
            getAllLane(false);
        } else {
        //  $('#lane_selection').append('<br>ตอนควบคุม : ');
            cloneToMap($("#toolbox select[name=mainsection]"), '#lane_selection', false, false);
        //	$('#lane_selection').append('เลน : ');
            cloneToMap($("#maptoolbox #mainLane"), '#lane_selection', false, false);
            $('#lane_selection #mainLane option:first').prop('selected', 'selected');
            $('#lane_selection #mainLane').addClass('span1').removeClass('span3');

            $('#lane_selection select[name=mainsection]').addClass('span2').removeClass('span3');
            
            $('#maptoolbox #mainLane option:first').prop('selected', 'selected');

            //Formulate Section
            g_search_info_level2.currentsection = _formSection(g_search_info.expressway,sectionCode,g_search_info.exptype,'F1')

          //  g_search_info_level2['currentsection'] = $('#lane_selection select.mainLane :selected').val();
          //  g_search_info_level2['currentcode'] = $('#lane_selection select.mainLane :selected').prop('title');

            this.getAllLane(true);
        }
    }

	 //Get data of all lane in one time
     this.getAllLane = function (all, isHDM4) {
        showLoading();
        // if (!isHDM4) {
        //     g_search_info_level2['kmstart'] = g_search_info['kmstart'];
        //     g_search_info_level2['kmend'] = g_search_info['kmend'];
        //     var section = g_search_info_level2.currentsection;
        // } else var section = g_hdm4_search['section'];
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

        if (section.indexOf('R') != -1) 
            var prefix = section.substr(0, section.indexOf('R'));
        else 
            var prefix = section.substr(0, section.indexOf('F'));

        var fingetalllane = false;
        if(!g_all_result_all_lane[suffix[0]])
        {
            model.getAllDamageInfo(g_search_info.infotype,25,prefix+suffix[0],g_search_info.exptype,$('select#hdm4type').val(),true);
        }
        for (var i = 1; i < suffix.length; i++) {
            var isection = prefix + suffix[i];
            var c = 0;
            if (!g_all_result_all_lane[suffix[i]]) {
                 model.getAllDamageInfo(g_search_info.infotype,25,isection,g_search_info.exptype,$('select#hdm4type').val());
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
    }

    //Show Data(table graph) of activated lane
    this.activatedResult = function (data, isHDM4) {
        if (!g_hdm4search_click) {
            if ($('#main_content').is(':hidden')) {
                $('#main_content').show();
            }
            if ($('#damagesearch').is(':hidden')) 
                showDamage();
            _rangefix = data['rangefix'];
            if (!g_search_info_level2.kmfreq) 
                g_search_info_level2.kmfreq = _rangefix;
            disableFreq();
            //g_search_info_level2['kmstart'] = g_search_info['kmstart'];
            //g_search_info_level2['kmend'] = g_search_info['kmend'];
        }
        g_all_result = data;

        g_search_info_level2.currentsection = g_all_result[0]['section'];
        if (g_search_info_level2['currentsection'].indexOf('R') != -1) {
            reverse = true;
        } 
        else 
            reverse = false;

        if (g_search_info_level2['kmend'] > parseFloat(g_all_result['lastkm']) || !g_search_info_level2['kmend']) 
            g_search_info_level2['kmend'] = parseFloat(g_all_result['lastkm']);
        if (!g_search_info_level2['kmstart']) 
            g_search_info_level2['kmstart'] = parseFloat(g_all_result[0]['subdistance']);

        this.calculatePlotData(isHDM4);
    }

     //Calculate Data based on KM Frequency
    this.calculatePlotData = function (isHDM4) {
        //Reset
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
            if (kmfreq != 5) {
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
        g_all_result['usedlength'] = Math.ceil((g_all_result['maxdis'] * 1000 - g_all_result['mindis'] * 1000) / 25);

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
       // if (!isHDM4) {
            $('#current_linedata').hide();
            setStartEndIndex(0, g_linedata.length - 1);
            view.createSlider('slider-range', 'range');
            _createGraph();
            view.createDataTable();
            $('#search-input .expressway').html(expcodeToExpressway(g_search_info['expressway']));
            $('#search-input .infotype').html(g_search_info['infotype']);
            $('#search-input .rangekm').html(toKm(g_data['kmstart']) + ' - ' + toKm(g_data['kmend']));
            $('.fullname').html(toFullName(g_search_info_level2['currentcode']));

            hideLoading();

            this.settingImage();

            //if(g_search_info_level2['kmfreq'] > 100 && Math.ceil(g_all_result['usedlength']/(g_search_info_level2['kmfreq']/5)) <= 20)
            //  reelSetup();
      //  }

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
        hideLoading();
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

    this.exportPDFhdm4 = function() {
        //Prepare data
        var year = $("#yearbudget .hdm4year").html();
        var expressway;
        if (g_hdm4_search['exptype'] != 2) expressway = $('#yearbudget .expressway').html();
        else expressway = $('select[name=expressway] option[value=' + g_search_info['expressway'] + ']').html() + ' / ' + $('#yearbudget .expressway').html();
        var hdm4type = $("#yearbudget .hdm4type").html();
        var totalcost = $("#totalcost").html();
        //Retrieve data from table
        showLoading();
        $.ajax({
            url: 'ajax/_export_pdf.php',
            type: 'POST',
            data: {
                expressway: expressway,
                year: year,
                hdm4type: hdm4type,
                hdm4data: g_hdm4_data_result,
                totalcost: totalcost
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
        var infotype = g_search_info['infotype'];
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
                currentkm: currentkm
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

	//Private Function

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
        switch(exptype){
            case "1":
                exptype = "M%";
                break;
            case "2":
               //
                break;
            case "3":
               //
                break;
        }

        return exp+section+exptype+dirlane;
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
        g_imageset = null;
	}

	_formValidation = function(temp_kms,temp_kme) {
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
	        if (temp_kme - temp_kms > 10 && valid) {
	            alert('ระยะทางต้องไม่เกิน 10 กม.');
	            valid = false;
	            $('#fix_range input[name=kmstart], #fix_range input[name=kmend]').css(notvalid);
	        }
  		}
        return valid;

	}
}
	