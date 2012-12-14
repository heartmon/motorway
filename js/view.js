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
      if(!data['error'])
      {
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
            var distance    = parseFloat(data[i]['sta']).toFixed(3);
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
        $("#pavementpager").show();
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
        else
        {
            $('#pavement_table').html('ไม่มีค่า pavement ในสายทางนี้');
            $("#pavementpager").hide();
        }

    }

    this.getPavementColumns = function(){
        var columns = ['ระยะทาง','รอยแตกหนังจระเข้','รอยแตกตามยาว','รอยร่องล้อ','ผิวหลุดร่อน','หลุม บ่อ','ผิวยุบตัวเป็นแอ่ง','ปะซ่อมผิว'];
        return columns;
    }
    this.getPavementColumnsWidth = function(){
        var width = [61,120,95,71,75,58,100,67];
        return width;
    }

    this.getHDM4Columns = function(){
        var columns = ['กม.เริ่มต้น','กม.สิ้นสุด','ทิศทาง','ช่องจราจร','ลักษณะการซ่อม','ราคา(ลบ.)','NPV/CAP'];
        return columns;
    }

    this.getHDM4ColumnsWidth = function(){
        var width = [68,68,55,76,242,75,71];
        return width;
    }

    //HDM4Table
    this.updateHDM4metadata = function() {

        var exp = toExpressName(g_hdm4_search.expressway);
        var section = g_hdm4_search.section;
        var code = g_hdm4_search['code'];
        var year = g_hdm4_search.year;
        var type = g_hdm4_search['type'];

        $("#hdm4result .expressway").html(exp);
        $("#hdm4result .section").html(code+' ('+section+')');

        if (year == 'all') 
            $("#hdm4result .hdm4year").html('ทุกปี');
        else 
            $("#hdm4result .hdm4year").html(parseInt((g_hdm4_search['year'])));

        // if (g_hdm4_search['expressway'] == "0101" || g_hdm4_search['expressway'] == "0102") {
        //     $("#hdm4result .expressway").html('เฉลิมมหานคร ช่วงที่ 1 - 2 (ดินแดง - บางนา)');
        // } else {
        //     //$("#hdm4result .expressway").html(expcodeToExpressway(g_hdm4_search['expressway']));
        //     if (g_hdm4_search['exptype'] == 1) $("#hdm4result .expressway").html($('select[name=expressway] option:selected').html());
        //     else if (g_hdm4_search['exptype'] == 3) $("#hdm4result .expressway").html($('select[name=accessname] option:selected').html());
        //     else $("#hdm4result .expressway").html($('select.enexname option:selected').html());
        // }


        //Type Conversion
        var type = "";
        if (g_hdm4_search['type'] == "unlimited") type = "ไม่จำกัดงบ";
        else if (g_hdm4_search['type'] == "limited_half") type = "แบบที่ 1  อ้างอิงงบปี 55";
        else type = "แบบที่ 2 เพิ่มอีก 10%";

        $("#hdm4result .hdm4type").html(type);

        //Set HDM4 base on expressway and exptype
        switch(g_hdm4_search['exptype'])
        {
            case "1":
                selectToList($('#toolbox #pavement_select select[name=mainsection'+g_hdm4_search.expressway+']'),$('#hdm4sectiondropdown'));
                break;
            default:
                selectToList($('#toolbox select.seclist:visible'),$('#hdm4sectiondropdown'));
        }        
        
        //Update Src of Graph
        $('#hdm4graph').prop('href', 'images/hdm4graph/' + g_hdm4_search['expressway'] + '-' + g_hdm4_search['exptype'] + '.jpg');
    }

    this.createHDM4table = function(row){
        $('#hdm4table').html('');

        var columns = this.getHDM4Columns();
        var w = this.getHDM4ColumnsWidth();
        var htmlcode = "<thead><tr><th>ลำดับ</th>";
        if (g_hdm4_search['year'] == 'all') 
            htmlcode += "<th>ปี</th>";
        for(var i = 0; i < columns.length; i++)
        {

            htmlcode += "<th width='"+w[i]+"'>";
            htmlcode += columns[i];
            htmlcode += "</th>";
        }
        htmlcode += "<th></th>";
        htmlcode += "</tr></thead>";
        htmlcode += "<tbody>";

        $('#hdm4table').append(htmlcode);

        g_hdm4_data_result = [];
        var count = 0;
       // console.log(row[i][lane]);
        for(var i = 0; i < row['length']; i++)
        {
         //   console.log(row[i]);
        //    count++;
            var year = row[i]['year'];
            var exp = row[i]['expressway'];
           
            var dir = row[i]['dir'].substr(row[i]['dir'].indexOf('ฝั่ง')+ 4);
            var lane = row[i]['lane'].substr(row[i]['lane'].indexOf('าจร') + 3);

            if(g_hdm4_search['exptype'] == "2")
            {
                dir = '-';
            }

            var kmstart = toKm(parseFloat(row[i]['kmstart']).toFixed(3));
            var kmend = toKm(parseFloat(row[i]['kmend']).toFixed(3));
            var workdes = row[i]['workdes'];
            var cost = parseFloat(row[i]['cost']).toFixed(3);
            var npv = parseFloat(row[i]['npv']).toFixed(2);

            htmlcode = "<tr>";

            htmlcode += "<td>" + (i+1) + "</td>";
            if (g_hdm4_search['year'] == 'all') htmlcode += "<td>" + (parseInt(year)) + "</td>";
            htmlcode += "<td style='text-align:right;'>" + kmstart + "</td><td style='text-align:right;'>" + kmend + "</td><td>" + dir + "</td><td>" + lane + "</td><td>" + workdes + "</td><td>" + cost + "</td><td>" + npv + "</td><td><i class='icon-facetime-video'></i></td></tr>";

            
            $('#hdm4table').append(htmlcode);
            //For PDF Data
            g_hdm4_data_result.push([year, kmstart, kmend, dir, lane, workdes, cost, npv]);
        }
        
        htmlcode = "</tbody>";
        $('#hdm4table').append(htmlcode);

        var text = 'จำนวนเงินทั้งหมดที่ใช้ ';
        if (g_hdm4_search['year'] != 'all') 
            text += "ในปี " + (parseInt(g_hdm4_search['year']));
        text += ' : <span class="color-blue">' + row['totalcost'] + '</span> ล้านบาท';

        //Total Cost Display
        $("#totalcost").html(text);

        //Set Pager using tablesorter plugin
        var myHeaders = {};
        $("#hdm4table").find('th').each(function (i, e) {
            myHeaders[$(this).index()] = {
                sorter: false
            };
        });

        $('.pager .first').unbind();
        $('.pager .last').unbind();
        $('.pager .prev').unbind();
        $('.pager .next').unbind();

        $("#hdm4table")
            .tablesorter({
            headers: myHeaders
        })
            .tablesorterPager({
            container: $("#hdm4pager"),
            size: 20
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