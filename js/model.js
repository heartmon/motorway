function Model()
{

	this.m = 1; 

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
                    g_video['first_image'] = parseInt(data[0]['frameno']) +  (g_all_result['mindis']*1000/5) ;
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


}