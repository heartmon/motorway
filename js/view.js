function View(){

	 this.createDataTable = function () {
        $('#table1 tbody').html('');
        for (var i = 0; i < g_linedata.length; i++) {
            var x = g_linedata[i][0];
            var y = g_linedata[i][1];
            if (i == g_linedata.length - 1) 
                var dataTo = toKm(g_all_result['maxdis']);
            else 
                var dataTo = toKm(parseFloat(g_linedata[i + 1][0]));
            //var dataTo = toKm(parseFloat(x)+g_search_info_level2.kmfreq/1000.0);
            var htmlcode = "<tr><td>" + toKm(x) + " - " + dataTo + "</td><td>" + y + "</td></tr>";
            $('#table1 tbody').append(htmlcode);
        }
        //console.log($('.tablescroll_head'));
        if ($('.tablescroll').length === 0) $('#table1').tableScroll({
            height: 320,
            width: 290
        });
    }

	//Create slider
    this.createSlider = function (container, range_container) {
        var container = $("#" + container);
        var rangeInfo = $("#" + range_container)
        container.slider({
            range: true,
            min: startIndex,
            max: endIndex,
            values: [startIndex, endIndex],
            slide: function (event, ui) {
                updateRange(ui, rangeInfo);
                updateChartAxis();
                updateDataTable();
                updateFlag(ui);
                if (g_video['first_image']) 
                    sliderSyncWithVideo(ui);
                //if ($('#video-player #reel_container').is(":visible")) {
                //    $('#reelthumbnail').reel('frame', ui.values[0] + 1);
                //}
            }
        });
        rangeInfo.html(toKm(g_data['kmstart']) + " - " + toKm(g_data['kmend']));
    }

    this.drawGraph = function() {
    var info = g_search_info.infotype;
    //Threshold:: Color: Green ,Yellow, Red
    switch (info) {
        case "roughness":
            var threshold1 = 2.68;
            var threshold2 = 3.5;
            var color1 = "#00bb00";
            var color2 = "#FFCC00";
            var color3 = "#DC0000";
            break;
        case "rutting":
            var threshold1 = 100;
            var threshold2 = 100;
            var color1 = "#00bb00";
            var color2 = "#FFCC00";
            var color3 = "#DC0000";
            break;
        case "texture":
            var threshold1 = 0.3;
            var threshold2 = "";
            var color1 = "#00bb00";
            var color2 = "#FFCC00";
            var color3 = "#DC0000";
            break;
    }
    //Vertical  Line Setting
    var vertical_line = [
        [-1, - 1],
        [-1, 999]
    ];

    if (selectedIndex >= 0) vertical_line = [
        [g_linedata[selectedIndex][0], - 1],
        [g_linedata[selectedIndex][0], 999]
    ];
    //Cutting infotype string Ex From **** - Skid to only Skid
    var typecut = getAbbInfoType(g_search_info.infotype);//.substr(g_search_info.infotype.indexOf("-") + 2);
    //Plot Graph
    if (info == "roughness") {
        plot = $.plot($("#line-chart"), [{
            data: g_linedata,
            color: color2,
            threshold: {
                above: {
                    limit: threshold2,
                    color: color3
                }
            }
        }, {
            data: vertical_line,
            color: '#1B9BE0'
        }, {
            data: g_linedata,
            color: color2,
            threshold: {
                below: {
                    limit: threshold1,
                    color: color1
                }
            }
        }, {
            label: typecut + " > " + threshold2,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color3
        }, {
            label: threshold1 + " >= " + typecut + " <= " + threshold2,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color2
        }, {
            label: typecut + " < " + threshold1,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color1
        }, {
            data: g_linedata,
            color: color2,
            lines: {
                show: false
            },
            points: {
                show: true
            },
            threshold: {
                below: {
                    limit: 2.5,
                    color: color1
                },
                above: {
                    limit: 3.5,
                    color: color3
                }
            }
        }], g_options);
    } else if (info == "texture") //one threshold
    {
        plot = $.plot($("#line-chart"), [
        //{ data:g_linedata, color:color2, threshold: {above: {limit: threshold2, color:color3} }},

        {
            data: g_linedata,
            points: {
                show: true
            },
            color: color1,
            threshold: {
                below: {
                    limit: threshold1,
                    color: color3
                }
            }
        }, {
            data: vertical_line,
            color: '#1B9BE0'
        }, {
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color2
        }, {
            label: typecut + " > " + threshold1,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color1
        },
        //  { label: threshold1+" >= "+typecut+" <= "+threshold2, data: [[-1,-1],[-1,-1]], color:color2 },
        {
            label: typecut + " < " + threshold1,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color3
        },
        //{ data:g_linedata, color:color2, lines:{show:false}, points:{show:true}, threshold: {below: {limit: 2.5, color:color1}, above: {limit: 3.5, color:color3}  }}
        ], g_options);
    } else //no threshold
    {
        plot = $.plot($("#line-chart"), [{
            data: g_linedata,
            color: color1,
            points: {
                show: true
            }
        }, {
            data: vertical_line,
            color: '#1B9BE0'
        }, {
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color2
        }, {
            label: typecut,
            data: [
                [-1, - 1],
                [-1, - 1]
            ],
            color: color1
        }], g_options);
    }
    $('canvas.base').attr('id', 'chartCanvas');
    $('canvas.overlay').attr('id', 'chartCanvasOverlay');
}	
}