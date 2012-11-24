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
            height: 285,
            width: 290
        });

        
    }

    //Pavement Table
    this.createPavement = function(data,headers,name){
       // container.prepend('<div id="pavement"></div>');
      // var columns = ['ระยะทาง','Lat','Long','รอยแตกหนังจระเข้','รอยแตกตามยาว','รอยร่องล้อ','ผิวหลุดร่อน','หลุม บ่อ','ผิวยุบตัวเป็นแอ่ง','ปะซ่อมผิว'];
      $('#pavement > div').first().find('h3').remove();
      for(h in headers)
      {
        var htmlcode = "<h3>";
        htmlcode += h;
        htmlcode += "<span class='color-orange'>" + headers[h] + "</span></h3>";
        $('#pavement > div').first().prepend(htmlcode);
      }

      $('#pavement_table').html('');
      var columns = this.getPavementColumns();
       var htmlcode = "<thead><tr><th>ลำดับ</th>";

       for(var i = 0; i < columns.length; i++)
       {
            htmlcode += "<th>";
            htmlcode += columns[i];
            htmlcode += "</th>";
       }
       htmlcode += "</tr></thead>";
       htmlcode += "<tbody>";
        g_pavement_array = [];
       for(var i = 0; i < data.length; i++)
       {
            var distance    = parseFloat(data[i]['distance']).toFixed(3);
            var crack_aca   = parseFloat(data[i]['crack_aca']).toFixed(3);
            var crack_act   = parseFloat(data[i]['crack_act']).toFixed(3);
            var bleeding    = parseFloat(data[i]['bleeding']).toFixed(3);
            var raveling    = parseFloat(data[i]['raveling']).toFixed(3);
            var phole       = parseFloat(data[i]['phole']).toFixed(3);
            var deformation = parseFloat(data[i]['deformation']).toFixed(3);
            var pacthing    = parseFloat(data[i]['pacthing']).toFixed(3);
            htmlcode += "<tr>";
            htmlcode += "<td>" + (i+1) + "</td>";
            htmlcode += "<td>" + distance + "</td>";
            htmlcode += "<td>" + crack_aca + "</td>";
            htmlcode += "<td>" + crack_act + "</td>";
            htmlcode += "<td>" + bleeding + "</td>";
            htmlcode += "<td>" + raveling + "</td>";
            htmlcode += "<td>" + phole + "</td>";
            htmlcode += "<td>" + deformation + "</td>";
            htmlcode += "<td>" + pacthing + "</td>";
            htmlcode += "</tr>";

            //For PDF Data
            g_pavement_array.push([distance, crack_aca, crack_act, bleeding, raveling, phole, deformation, pacthing]);
       }
       htmlcode += "</tbody>";
       $('#pavement_table').append(htmlcode);
      // alert('cas');
       //alert(htmlcode);

        //Set Pager using tablesorter plugin
        var myHeaders = {};
        $("#pavement_table").find('th').each(function (i, e) {
            myHeaders[$(this).index()] = {
                sorter: false
            };
        });

        $('.pager .first').unbind();
        $('.pager .last').unbind();
        $('.pager .prev').unbind();
        $('.pager .next').unbind();

        $("#pavement_table")
            .tablesorter({
            headers: myHeaders
        })
            .tablesorterPager({
            container: $("#pavementpager"),
            size: 20
        });

    }

    this.getPavementColumns = function(){
        var columns = ['ระยะทาง','รอยแตกหนังจระเข้','รอยแตกตามยาว','รอยร่องล้อ','ผิวหลุดร่อน','หลุม บ่อ','ผิวยุบตัวเป็นแอ่ง','ปะซ่อมผิว'];
        return columns;
    }
    this.getPavementColumnsWidth = function(){
        var width = [61,120,95,71,75,58,100,67];
        return width;
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
            var threshold1 = 2.5;
            var threshold2 = 3.5;
            var color1 = "#00bb00";
            var color2 = "#FFCC00";
            var color3 = "#DC0000";
            break;
        case "rutting":
            var threshold1 = 6;
            var threshold2 = 12;
            var color1 = "#00bb00";
            var color2 = "#FFCC00";
            var color3 = "#DC0000";
            break;
        case "texture":
            var threshold1 = 100;
            var threshold2 = 100;
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
    if (info == "roughness" || info == "rutting") {
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
                    limit: threshold1,
                    color: color1
                },
                above: {
                    limit: threshold2,
                    color: color3
                }
            }
        }], g_options);
    } else if (info == "xxxxx") //one threshold
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