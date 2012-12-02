function Model()
{

	this.m = 1; 

    this.getPavement = function(kmstart,kmend){
        $.ajax({
            url: 'ajax/_get_pavement.php',
            type: 'GET',
            data: {
                section: g_search_info_level2['currentsection'],
            },
            dataType: 'jsonp',
            dataCharset: 'jsonp',
            success: function (data) {
                if (!data['error']) {
                    g_pavement = data;
                    g_search_info_level2.currentsection = data[0]['section'];
                    controller.setupPavement(data);
                   // console.log(data);
                } 
                else {
                    errorReport(data['error']);
                    controller.setupPavement(data);
                }
            }
        });
    }

	this.getAllDamageInfo = function(infotype,kmfreq,section,exptype,hdm4type,activated){
		sync = true;
		$.ajax({
            url: 'ajax/_ignore_section.php',
            type: 'GET',
            data: {
                //expressway: g_search_info.expressway, //only value number of expressway are sent.
                kmstart: g_search_info_level2['kmstart'],
                kmend: g_search_info_level2['kmend'],
                infotype: infotype,
                kmfreq: kmfreq,
                section: section,
                exptype: exptype,
                hdm4type: hdm4type
            },
            dataType: 'jsonp',
            dataCharset: 'jsonp',
            success: function (data) {
                if (!data['error']) {
					//mdata = data; 
					//console.log(data);   
					sync = false;
					controller.setAllResult(data);
					if(activated)
						controller.activatedResult(data);
                } 
                else {
                    errorReport(data['error']);
                    hideLoading();
                }
            },
            complete: function(data){
            	
            }

        });
	}

    this.getFirstImage = function(section){
        finish_getimage = false;
         $.ajax({
            url: 'ajax/_getFirstImage.php',
            type: 'GET',
            data: {
                section: section
            },
            dataType: 'jsonp',
            dataCharset: 'jsonp',
            success: function (data) {
                if (!data['error']) {
                    //Set first image to variable
                    g_video['first_image'] = parseInt(data[0]['frameno']) +  (g_all_result['dist_image']*1000/5) ;
                    console.log(data);
                    finish_getimage = true;

                    //Initialize and Setup video
                   if ($('#videoplayer').find('div').hasClass('jsMovieFrame')) $('#videoplayer').jsMovie("destroy");
                   $('#videoplayer').data("loadStatus", 'loaded');

                  //  Preload video
                   openVideo();
                   videoPreloader();

                   if (!g_hdm4search_click) {
                        $('#table1 tr').eq(0).click();
                        scrollTable();
                    }
                   
                } else {
                    errorReport(data['error']);
                }
            }
        });
    }

    this.getHDM4Result = function(exp,hdm4type,year,exptype,section){
        showLoading();
        $.ajax({
            url: 'ajax/_hdm4search.php',
            type: 'GET',
            data: {
                expressway: exp, //only value number of expressway are sent.
                type: hdm4type,
                year: year,
                exptype: exptype,
                section: section,
            },
            dataType: 'jsonp',
            dataCharset: 'jsonp',
            success: function (data) {
                if (!data['error']) {
                    if ($('#main_content').is(':hidden')) $('#main_content').show();
                    showdata($('#hdm4result'));
                    var totalcost = data['totalcost'];
                   // delete data['totalcost'];
                   // updateHDM4metadata();
                    g_hdm4_result = data;
                  //  createHDM4table(data, totalcost);
                    $('input:radio[name=hdm4year][value=' + g_hdm4_search['year'] + ']').prop('checked', true);
                    //g_hdm4_search['section'] = ..;
                    controller.setHDM4();
                } else {
                    g_hdm4_search['year'] = g_hdm4_search['prevyear'];
                    alert(data['error']);
                    // errorReport(data['error']);
                }
                hideLoading();
            }
        });
    }


}