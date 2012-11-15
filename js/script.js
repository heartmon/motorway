//GLOBAL VAR
var plot;
var startIndex;
var endIndex;

var g_data = {
    kmstart: "",
    kmend: ""
};

var selectedIndex = -1;
var g_linedata = [];
var g_all_result;
var g_all_result_all_lane = [];
var g_options;
var g_search_info = {
    expressway: "",
    kmstart: "",
    kmend: "",
    infotype: "",
    exptype: "",
};
var g_search_info_level2 = {
    kmstart: "",
    kmend: "",
    kmfreq: 25,
    currentlane: "",
    currentsection: "",
    currentcode: ""
};
var g_hdm4_search = {
    expressway: "",
    year: "",
    type: "",
    prevyear: "",
    section: "",
    exptype: "",
    dropdownOrder: ""
};
var g_hdm4_data_result = [];
var _kmfreq = [25, 50, 100, 500, 1000];
var _rangefix = 25;
var g_imageset;
var finish_getimage = false;
var HDM4videoclick = false;

var g_current_var = {
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
var g_video = {
    first_image: "",
    length: ""
};
var g_hdm4search_click = false;
var reverse = false;

var controller = new Controller();
var view = new View();
var model = new Model();
var mdata;
var sync = false;

$(function (){

    init();

     $("#video-map-display").hide();

     $("[type='submit']").click(function () {
         $("#placeholder").hide();
         $("#video-map-display").show();
     });

    // $("#option2").fadeOut();

    function init() {
        //Hide Result Interface
        $('#main_content').hide();
       // $('#lane_selection').hide();
        $('#pager').hide();
     //   $('#damagesearch').hide();
        $('#hdm4result').hide();
        $("#option_lane").hide();
       // $(".mainLane").hide();
       // $('#fix_range').hide();
        $('#option2').hide();
        $('select[name=mainsection09]').hide();

        $("a.video_lightbox").fancybox({
            'transitionIn': 'none',
            'transitionOut': 'none',
            'width': 640,
            'height': 480,
            'autoScale': true,
            //'type' : 'iframe'
            onStart: function () {
                $("#videodialog").css('display', 'block');
                if ($('#videoplayer').data("loadStatus") == "loaded") $("#videopreloader").fadeOut();
                $("#fancybox-outer").width(498);
            },
            onClosed: function () {
                $("#videodialog").css('display', 'none');
                $('#videoplayer').jsMovie('stop');

                $("#videopreloader div.bar").css('width', '');
                $("#videopreloader .percentage").html('');
            },
            afterLoad: function(){
                $("#fancybox-outer").width(498);
            }
        });

        $("a.fancyimage").click(function () {
            $.fancybox({
                //'autoDimensions': false, 
                'autoscale': true,
                'content': '<img src="' + this.href + '" width="460" height="380" />',
                'scrolling': 'no'
            });
            return false;
        });
    }

    $('#search').bind('click', function () {
        controller.damageSearch();
        $("#maptoolbox #mainLane").find('option').eq(0).prop('selected', 'selected');
        return false;
    });

    $('#kmfreq').prev().bind('click', function() {
        if (!$(this).hasClass('disabled')) {

            var i = _kmfreq.indexOf(parseInt($('#kmfreq').html()));
            if (i - 1 >= 0) {
                $('#kmfreq').html(_kmfreq[i - 1]);
                g_search_info_level2.kmfreq = parseInt($('#kmfreq').html());
            }
            if (i - 1 == _kmfreq.indexOf(_rangefix)) 
                $('#kmfreq').prev().addClass('disabled');
            $('#kmfreq').next().removeClass('disabled');
            controller.calculatePlotData();
            return false;
        }
    });

    $('#kmfreq').next().bind('click', function() {
        if (!$(this).hasClass('disabled')) {
            var i = _kmfreq.indexOf(parseFloat($('#kmfreq').html()));
            if (i + 1 < _kmfreq.length) {
                $('#kmfreq').html(_kmfreq[i + 1]);
                g_search_info_level2.kmfreq = parseInt($('#kmfreq').html());
            }
            if (i + 1 == _kmfreq.length - 1) 
                $(this).addClass('disabled');
            $('#kmfreq').prev().removeClass('disabled');
            controller.calculatePlotData();
            //alert('what');
            return false;
        }
    });

    //=================== Map Resizing ==========================
    //MapResize
    $(window).resize(function () {
        mapResize();
    });

    function mapResize() {
        if ($('#container_map').hasClass('maximize')) {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            $('#container_map, #map').width(windowWidth - 40 + 'px');
            $('#container_map, #map').height(windowHeight - 40 + 'px');
            map.updateSize();
        }
    }

    //Maximize map
    $('#maximize-map-display').toggle(function () {
        if ($('#container_map').hasClass('mapclose')) $('#toggle-map-display').addClass('fromClose').click();
        $('#container_map, #maximize-map-display, #toggle-map-display, #video-map-display').addClass('maximize');
        $('#container_map').parent().css('height', '368px');
        $(this).children().removeClass('icon-resize-full').addClass('icon-resize-small')
        $(this).attr('title', 'ย่อแผนที่');
        mapResize();

        //clone
        $("#maptoolbox").show();
        $('#maptoolbox #mainLane option').prop('selected', '');
        $('#maptoolbox #mainLane option').eq($('#lane_selection #mainLane option:selected').index()).prop('selected', 'selected');

    }, function () {
        $("#maptoolbox").hide();
        $('#container_map, #maximize-map-display, #toggle-map-display, #video-map-display').removeClass('maximize');
        $('#container_map, #map').css('width', '');
        $('#container_map, #map').css('height', '');
        $(this).children().removeClass('icon-resize-small').addClass('icon-resize-full')
        $('#container_map').parent().css('height', '');
        $(this).attr('title', 'ขยายแผนที่');
        map.updateSize();

        if (g_all_result) {
            qtip.removeAllFeatures();
            addPoints(g_all_result);
        }

    });

    $('#container_map, #toggle-map-display, #maximize-map-display, #video-map-display').hover(function () {
        if ($('#toggle-map-display i').hasClass('icon-chevron-up')) $('#toggle-map-display').stop().animate({
            opacity: 0.8
        });
        $('#maximize-map-display').stop().animate({
            opacity: 0.8
        });
        $('#video-map-display').stop().animate({
            opacity: 0.8
        });
    }, function () {
        if ($('#toggle-map-display i').hasClass('icon-chevron-up')) $('#toggle-map-display').stop().animate({
            opacity: 0
        });
        $('#maximize-map-display').stop().animate({
            opacity: 0
        });
        $('#video-map-display').stop().animate({
            opacity: 0
        });
    });

    //Minimize map
    $('#toggle-map-display').toggle(function () {
        if ($('#container_map').hasClass('maximize')) $('#maximize-map-display').click();
        $('#container_map').addClass('mapclose');
        $('#container_map').stop().animate({
            height: 5,
            'margin-bottom': 35,
            'padding-bottom': 0
        }, 'fast');
        $('#map').stop().animate({
            top: -325
        }, 'fast');
        $('#toggle-map-display, #maximize-map-display, #video-map-display').css('bottom', '15px');
        $(this).attr('title', 'เปิดแผนที่');
        $(this).children().removeClass('icon-chevron-up').addClass('icon-chevron-down')
    }, function () {
        $('#container_map').removeClass('mapclose');
        if ($(this).hasClass('fromClose')) {
            $('#container_map').css('height', '').css('margin-bottom', '').css('padding-bottom', '');
            $('#map').css('top', '');
            $(this).removeClass('fromClose');
        } else {
            $('#container_map').stop().animate({
                height: 330,
                'margin-bottom': 20,
                'padding-bottom': 8
            }, 'fast');
            $('#map').animate({
                top: 8
            }, 'fast');
        }
        $(this).children().removeClass('icon-chevron-down').addClass('icon-chevron-up');
        $(this).attr('title', 'เก็บแผนที่');
        $('#toggle-map-display, #maximize-map-display, #video-map-display').css('bottom', '');
    });

    //================== Toolbox Maptoolbox Sync ========================

    //Sync Select input
    function HTMLselectTagBinding(selector, selectedOne, except) {
        selector = $(selector);
        if (except) selector = $(selector).not(except);
        var index = selectedOne.find('option:selected').prop('selected', 'selected').index();
        selector.each(function () {
            $(this).find('option').eq(index).prop('selected', 'selected');
        });
    }

    function skipSearch1Setting(selector) {
        //  g_search_info['expressway'] = $('select[name=expressway]').val();
        g_search_info['exptype'] = $('select[name=exptype]').val();
        //  g_search_info['infotype'] 
        g_search_info_level2['currentsection'] = selector.val();
        g_search_info_level2['currentcode'] = selector.find('option:selected').html();
    }

        //To show TYPE[main, access, enex] **S1 does not have enex
    function showExpType(exp) {
        $('select[name=exptype] option').show();

        if (exp == "03") {
            $('select[name=exptype] option[value=2]').hide();
            $('select[name=exptype] option[value=1]').prop('selected', 'selected');
            $('#option1').show();
        }
    }

    //Show Dropdown of each type
    function showTypeDropdown(exp, exptype) {
        $('.enexname').not('#lane_selection .enexname').hide();
        $('.accessname').not('#lane_selection .accessname').hide();
        $('.mainsection').not('#lane_selection .mainsection').hide();
        $('.intersect').not('#lane_selection .intersect').hide();
        $('#maptoolbox #mainLane').hide();
        $('#maptoolbox .mainsection').hide();
        if (exptype == "2") {

            var elem = "enexname" + exp;
            $('select[name=' + elem+']').not('#lane_selection .enexname').show().find('option:first').prop('selected', 'selected');
            $('#maptoolbox .enexname').remove();
            cloneToMap($('select[name=' + elem+']'), '#maptoolbox #selectname');
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option').not(':first').hide();

        } else if (exptype == "3") {
            var elem = "accessname" + exp;
            $('#maptoolbox .accessname').remove();
            $('select[name=' + elem+']').not('#lane_selection .accessname').show().find('option:first').prop('selected', 'selected');
            //$('.accessname').clone().removeClass('input-spanall').addClass('span3').appendTo('#maptoolbox #selectname').find('option').eq(index).prop('selected','selected');
            cloneToMap($('select[name=' + elem+']'), '#maptoolbox #selectname');
            $('#maptoolbox #mainLane').prop('multiple','multiple');
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option').not(':first').hide();
        } else if(exptype == "4") {
            var elem = "intersect" + exp;
            $('#maptoolbox .intersect').remove();
            $('select[name=' + elem+']').not('#lane_selection .intersect').show().find('option:first').prop('selected', 'selected');
            //$('.accessname').clone().removeClass('input-spanall').addClass('span3').appendTo('#maptoolbox #selectname').find('option').eq(index).prop('selected','selected');
            cloneToMap($('select[name=' + elem+']'), '#maptoolbox #selectname');
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option').not(':first').hide();
        } else {
            $('#maptoolbox #mainLane').show();
            var elem = "mainsection" + exp;
             $('#maptoolbox .mainsection').remove();
            $('select[name=' + elem+']').not('#lane_selection .accessname').show().find('option:first').prop('selected', 'selected');
            //$('#maptoolbox select[name=mainsection]').show();

            cloneToMap($('select[name=' + elem+']'), '#maptoolbox #selectname');
            $('#maptoolbox #mainLane').prop('multiple','multiple');
            $('#maptoolbox #mainLane').find('option:first').prop('selected','selected');
          //  mainLane(exp);
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option').not(':first').show();
        }

    }

    //Clone Init
    cloneToMap($("#toolbox select[name=expressway]"), '#maptoolbox #expnametype', true);
    cloneToMap($("#toolbox select[name=exptype]"), '#maptoolbox #expnametype', true);
    cloneToMap($("#toolbox .mainsection"), '#maptoolbox #selectname', true);
    cloneToMap($("#lane_selection select[name=mainLane]"), '#maptoolbox #selectname', true, true);
    //Initial
    showTypeDropdown($('select[name=expressway]').val(), $("#exptype").val());
    showExpType($('select[name=expressway]').val());
    //$("#maptoolbox .mainLane").show();
    $("#maptoolbox #damage").append('<select name="infotype" class="span3 infotype"><option value="texture">ค่าพื้นผิว - Texture</option><option selected value="roughness">ค่าความขรุขระ - IRI</option><option value="rutting">ค่าร่องล้อ - Rutting</option></select>');
    $("#maptoolbox").hide();

    //Sync mainsection
     $('#maptoolbox .mainsection, #lane_selection .mainsection').live('change', function () {
        HTMLselectTagBinding('select.mainsection', $(this), '#lane_selection select.mainsection');
        $('#toolbox input[name=kmstart]').val(0);
        $('#toolbox input[name=kmend]').val(2);
        controller.damageSearch(); 
    });

     $('#toolbox .mainsection').live('change',function(){
        $('#toolbox input[name=kmstart]').val('');
        $('#toolbox input[name=kmend]').val('');
     });

    //When change expressway clear kmrange
    $('select[name=expressway]').live('change', function () {
        $('#toolbox input[name=kmstart], #toolbox input[name=kmend]').val('');
        HTMLselectTagBinding('select[name=expressway]', $(this));
        var expcode = $(this).val();
        showExpType(expcode);
        showTypeDropdown(expcode, $('select[name=exptype]').val());
        $('#toolbox input[name=kmstart]').val('');
        $('#toolbox input[name=kmend]').val('');
    });

    //autofill KM for #maptoolbox
    $('#maptoolbox select[name=expressway]').live('change', function () {
        if($(this).val() == "1")
        {
            $("#fix_range").show();
            $('#toolbox input[name=kmstart]').val(0);
            $('#toolbox input[name=kmend]').val(2);
        }   
        controller.damageSearch(); 
    });

    //Sync exenname
    $('select.enexname').live('change', function () {
        HTMLselectTagBinding('select.enexname', $(this), '#lane_selection .enexname');
    });

    //Sync accessname
    $('select[name=accessname]').live('change', function () {
        HTMLselectTagBinding('select[name=' + $(this).prop('id') + ']', $(this), '#lane_selection .accessname');
    });

    //Sync intersect
    $('select.intersect').live('change', function () {
        HTMLselectTagBinding('select.intersect', $(this), '#lane_selection .intersect');
    });

    $('#maptoolbox .accessname, #lane_selection .accessname').live('change', function () {
        controller.damageSearch(); 
        zoomCoor();
    });

    $('#maptoolbox .enexname, #lane_selection .enexname').live('change', function () {
        controller.damageSearch(); 
    });

    $('#maptoolbox .intersect, #lane_selection .intersect').live('change', function () {
        controller.damageSearch(); 
    });

    $('#maptoolbox select[name=infotype]').live('change', function () {
        if ($("#main_content").is(":hidden")) {
            controller.damageSearch(); 
        } else {
            g_search_info['infotype'] = $(this).find('option:selected').val();
           controller.activatedResult(g_all_result);
        }
    });

    $('#lane_selection #mainLane').live('change', function () {
        var index = $(this).find('option:selected').prop('selected', 'selected').index();
        $('#maptoolbox #mainLane option').prop('selected', '');
        $('select[name=mainLane]').each(function () {
            $(this).find('option').eq(index).prop('selected', 'selected');
        });

        $("#fix_range").show();
        g_search_info_level2['currentsection'] = g_search_info_level2['currentsection'].substr(0,9) + $(this).val();
       // g_search_info_level2['currentcode'] = $(this).find('option[value="' + $(this).val() + '"]').prop('title');
        g_search_info['exptype'] = $('select[name=exptype]').val();
        if ($("#main_content").is(":hidden") || g_search_info['searchtype'] == 'overlap') 
            controller.damageSearch(); 
        else 
            controller.activatedResult(g_all_result_all_lane[$(this).val()]);
    });

    $('select[name=infotype], input[name=infotype]').live('change', function () {
        var info = $(this).prop('value');
        console.log(info);
        $('input[name=infotype][value=' + info + ']').prop('checked', 'checked');
        $('select[name=infotype] option[value=' + info + ']').prop('selected', 'selected');
    });


    $('select[name=exptype]').live('change', function () {
        //$('#kmstart, #kmend').val('');
        var index = $(this).find('option:selected').prop('selected', 'selected').index();
        $('select[name=exptype]').each(function () {
            $(this).find('option').eq(index).prop('selected', 'selected');
        });

        if ($(this).val() == "1") {
            $("#option1").show();
            $("#option2").hide();
            $("#maptoolbox .mainLane").show();
            showTypeDropdown($('select[name=expressway]').val(), $(this).val());
            $('#toolbox input[name=kmstart]').val(0);
            $('#toolbox input[name=kmend]').val(2);
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option').not(':first').show();
        } else {
            $("#option2").show();
            $("#option1").hide();

            showTypeDropdown($('select[name=expressway]').val(), $(this).val());
            $('#toolbox input[name=kmstart]').val('');
            $('#toolbox input[name=kmend]').val('');
            //Hide Limited_Half and Limited_Full of HDM4
            $('select#hdm4type option:first').prop('selected', 'selected');
            $('select#hdm4type option').not(':first').hide();

        }
        if($(this).val() == "3")
            $("#maptoolbox .mainLane").show();
    });

    $('#maptoolbox select[name=exptype]').live('change', function () {
        controller.damageSearch(); 
    });

    //Addpoint of lanes
    $('#maptoolbox select#mainLane').live('change', function () {
        qtip.removeAllFeatures();
        var suffix = [];
        $(this).find('option:selected').each(function () {
            var s = $(this).val();
            addPoints(g_all_result_all_lane[s]);
        });
    });

    //Plot Click
    $("#line-chart").bind("plotclick", function (event, pos, item) {
        plot.unhighlight();
        var nearest = nearestIndex(pos.x);
        updateVertical(nearest);
        highlightTable(nearest);
        updateCurrentVar(nearest);
        //reelUpdate(nearest);

        //Update Scroll Bar of Data Table No.1
        var tablehl = $('.table_highlight');
        var tableWrapper = $('#table1').parent();
        tableWrapper.scrollTop(tableWrapper.scrollTop() + tablehl.position().top - tablehl.height() * 4 - tableWrapper.position().top);
    });

    //Export PDF and Excel
    $("#hdm4excel").bind('click', function () {
        var expressway;
        if (g_hdm4_search['exptype'] != 2) expressway = $('#yearbudget .expressway').html();
        else expressway = $('select[name=expressway] option[value=' + g_search_info['expressway'] + ']').html() + ' / ' + $('#yearbudget .expressway').html();

        var head = expressway + ";;" + $("#yearbudget .hdm4year").html() + ";;" + $("#yearbudget .hdm4type").html() + ";;" + $("#totalcost").html();
        $("#genexcel input[name=head]").val(head);
        $("#genexcel input[name=exceldata]").val(g_hdm4_data_result.join(";;"));
        $("#genexcel").submit();
        return false;
    });

    $("#exportPDF").bind('click', controller.exportPDF);
    $("#hdm4pdf").bind('click', controller.exportPDFhdm4);

});


//Global Function

//Update datatable
function updateDataTable() {
        var allrow = $('#table1 tbody tr');
        allrow.slice(0, startIndex).hide();
        allrow.slice(startIndex, endIndex + 1).show();
        allrow.slice(endIndex + 1).hide();
    }

//Update range of jquery slider
function updateRange(ui, rangeInfo) {
    if (ui.values[1] - ui.values[0] >= 2) {
        $('#slider-range').slider("enable");
        setStartEndIndex(ui.values[0], ui.values[1]);
        rangeInfo.html(toKm(g_data['kmstart']) + " - " + toKm(g_data['kmend']));
        $('#search-input .rangekm').html(toKm(g_data['kmstart']) + ' - ' + toKm(g_data['kmend']));
    }

}

function updateChartAxis(serie_id) {
        g_options.xaxis.min = g_data['kmstart'];
        g_options.xaxis.max = g_data['kmend'];
        view.drawGraph();
    }

//Update Flag
function updateFlag(ui) //Trigger when slider is slided
    {
        findex = ui.values[0] * g_all_result['offset'];
        lindex = ui.values[1] * g_all_result['offset'] + g_search_info_level2['kmfreq'] / 5;
        if (lindex > g_all_result['usedlength']) lindex = g_all_result['usedlength'];
        g_current_var['flagfirstlat'] = g_all_result[findex]['lat'];
        g_current_var['flagfirstlong'] = g_all_result[findex]['long'];
        g_current_var['flaglastlat'] = g_all_result[lindex]['lat'];
        g_current_var['flaglastlong'] = g_all_result[lindex]['long'];
    }

function cloneToMap(source, target, nl, multiple) {
    var index = source.find('option:selected').prop('selected', 'selected').index();
    source.clone().removeClass('input-spanall').addClass('span3').appendTo(target).find('option').eq(index).prop('selected', 'selected');
    if (nl) $(target).append('<br>');
    if (!multiple) $(target).find('select').prop('multiple', '');
}

function setStartEndIndex(start_i, end_i) {
        startIndex = start_i;
        endIndex = end_i;
        g_data['kmstart'] = g_linedata[startIndex][0];
        g_data['kmend'] = g_linedata[endIndex][0];
    }

function highlightTable(index) {
        $('#table1 tbody tr.table_highlight').removeClass("table_highlight");
        $('#table1 tbody tr').eq(index).addClass('table_highlight');

        if ($('#current_linedata').is(':hidden')) 
            $('#current_linedata').show();
        var ydata = getAbbInfoType(g_search_info['infotype']) + ": " + $('#table1 tbody tr.table_highlight td:last').html() + " ";
        var selectedkm = $('#table1 tbody tr.table_highlight td:first').html();
        $('#current_linedata span.selectedkm').html(selectedkm);
        $('#current_linedata span.ydata').html(ydata);

        updateVideo(index);
    }

function scrollTable() {
    //Update Scroll Bar of Data Table No.1
    var tablehl = $('.table_highlight');
    var tableWrapper = $('#table1').parent();
    tableWrapper.scrollTop(tableWrapper.scrollTop() + tablehl.position().top - tablehl.height() * 4 - tableWrapper.position().top);
}

//Datatable(Table1) Click
$('#table1 tbody tr').live('click', function () {
    var index = $(this).parent().children().index($(this));
    highlightTable(index);
    updateVertical(index);
    updateCurrentVar(index);
  //  reelUpdate(index);
});

//Update image data when clicked
function updateVideo(index) {
    selectMapPoint(index);
    var latitute = g_all_result[index * g_all_result['offset']]['lat'];
    var longtitute = g_all_result[index * g_all_result['offset']]['long'];
    var selectedkm = $('#table1 tbody tr.table_highlight td:first').html();
    var ctrlSection = g_all_result[index * g_all_result['offset']]['section'];
    var image_index = index * g_all_result['offset'];
   
    $('.latitute').html(latitute);
    $('.longtitute').html(longtitute);
    $('#video-detail .selectedkm').html(selectedkm);
    $('.control-section').html(ctrlSection);

    if ($('#video-player #reel_container').is(":hidden")) {
        //var index_image = index * g_search_info_level2.kmfreq / 25 * (g_search_info_level2['kmfreq']/25);
        var index_image = (index * (g_search_info_level2.kmfreq / 25 )* 5);

        $('#video-player #thumbnail').empty();
        $('#video-player #thumbnail').html('<img src="" />');
        $('#video-player #thumbnail img').attr("src", "images/imgloading.gif").attr("width", "370").attr("height", "240");

        var wait = setInterval(function () {
            if (finish_getimage) {
                clearInterval(wait);
                var imgpath = "asset_images/" + g_search_info_level2.currentsection + "/" + (parseInt(g_video['first_image'])+index_image) + ".jpg";
                console.log(imgpath);
                $('#video-player #thumbnail img').attr("src", imgpath);
            }
        }, 200);

        $("#video-player #thumbnail img").error(function () {
            $(this).attr("src", "images/imgerror.gif");
            var imgpath = "asset_images/" + g_search_info_level2.currentsection + "/" + (parseInt(g_video['first_image'])+index_image) + ".jpg";
            //alert('Image not found:\n'+'Location: '+imgpath);
            errorReport('Image not found:\n' + 'Location: ' + imgpath);
        });
    }

}

function updateVertical(index) {
    selectedIndex = index;
    //console.log(selectedIndex);
    var y = plot.getData()[1].datapoints.points;
    y[0] = y[2] = g_linedata[index][0];
    plot.draw();
}

 function updateCurrentVar(index) {
        index = index * g_all_result['offset'];
        eindex = index + g_search_info_level2['kmfreq'] / 5;
        if (eindex > g_all_result['usedlength']) eindex = g_all_result['usedlength'];
        //Add Update For section
        g_current_var['section'] = g_all_result[index]['section'];
        g_current_var['index'] = index;
        g_current_var['kmstart'] = parseFloat(g_all_result[index]['subdistance']);
        g_current_var['kmend'] = parseFloat(g_all_result[eindex]['subdistance']);
        g_current_var['lat'] = parseFloat(g_all_result[index]['lat']);
        g_current_var['longi'] = parseFloat(g_all_result[index]['long']);
        g_current_var['mpd'] = parseFloat(g_all_result[index]['mpd']).toFixed(4);
        g_current_var['iri_avg'] = parseFloat(g_all_result[index]['iri_avg']).toFixed(4);
        g_current_var['rut_lane'] = parseFloat(g_all_result[index]['rut_lane']).toFixed(4);
    }


function setUpCurrentVar() {
        g_current_var['section'] = g_search_info_level2['currentsection'];
        g_current_var['rangekmstart'] = g_all_result['mindis'];
        g_current_var['rangekmend'] = g_all_result['maxdis'];
        //For Flag Positioning
        var lastindex = g_all_result['usedlength'];
        g_current_var['flagfirstlat'] = g_all_result[0]['lat'];
        g_current_var['flagfirstlong'] = g_all_result[0]['long'];
        g_current_var['flaglastlat'] = g_all_result[lastindex]['lat'];
        g_current_var['flaglastlong'] = g_all_result[lastindex]['long'];

    }

//Check nearest point when user click on graph
function nearestIndex(xpos) {
    var begin = 0;
    var fin = g_linedata.length - 1;
    var middle;
    while (begin < fin) {
        middle = Math.floor((begin + fin) / 2);
        if (g_linedata[middle][0] < xpos) begin = middle + 1;
        else fin = middle;
    }
    var nearest = 0;
    if (fin != 0) nearest = xpos - g_linedata[fin - 1][0] < g_linedata[fin][0] - xpos ? fin - 1 : fin;
    return nearest;
}

function videoPreloader() {
    $("#videopreloader div.bar").css('width', '');
    $("#videopreloader .percentage").html('');
    var imageloaded = 0;
    imageloaded = 0;
    var preload;
    clearInterval(preload);
    if ($("#videopreloader").is(":hidden")) $("#videopreloader").show();

    preload = setInterval(function () {
        if ($('#videoplayer').data("loadStatus") == "loading") {
            if ($('div.jsMovieFrame').eq(imageloaded).css('background-image') != "none") {
                imageloaded++;
                var allimage = g_video['length'];
                var width = (imageloaded * $("#videopreloader").width()) / allimage;
                var percentage = (imageloaded / allimage * 100).toFixed(0) + "%";
                $("#videopreloader div.bar").css('width', width + 'px');
                $("#videopreloader .percentage").html(percentage);

            }
        } else {
            $('#videoplayer').data("loadStatus", 'loaded');
            clearInterval(preload);
            $("#videopreloader .percentage").html('100%');
            $("#videopreloader div.bar").css('width', $("#videopreloader").width() + 'px');
            setTimeout(function () {
                $("#videopreloader").fadeOut();

            }, 200);
        }
    }, 10);
}

function showLoading() {
$('#loading').show();
//$('#loading').css('top',$('body').scrollTop()-100);

}

function hideLoading() {
    $('#loading').hide();
}

function errorReport(errmsg) {
    var noreport = $('div.errorreport').length;
    //  console.log(errmsg);
    //errmsg = errmsg.replace("\n","\r\n");
    var htmlcode = '<div class="errorreport alert alert-error alert-block"><button type="button" class="close" data-dismiss="alert">×</button><strong>' + 'Error! ' + '</strong>' + errmsg + '</div>';
    $('.container').prepend(htmlcode);
    //$('div.errorreport').css('top',$('body').scrollTop()-100);
    $('div.errorreport:first').css('z-index', 3000 + noreport);
}

//======================= KmFreq Function ===================================
    function disableFreq() {
        $('#kmfreq').html(g_search_info_level2.kmfreq);
        var index = _kmfreq.indexOf(parseFloat($('#kmfreq').html()));
        if (index <= _kmfreq.indexOf(_rangefix)) {
            $('#kmfreq').prev().addClass('disabled');
            $('#kmfreq').html(_rangefix);
            g_search_info_level2.kmfreq = _rangefix;
        } else $('#kmfreq').prev().removeClass('disabled');
        if (index == _kmfreq.length - 1) $('#kmfreq').next().addClass('disabled');
        else $('#kmfreq').next().removeClass('disabled');
    }

    

function getInfoType(infotype) {
    var column_info_name;
    if (infotype == 'roughness') column_info_name = 'iri_avg';
    else if (infotype == 'rutting') column_info_name = 'rut_lane';
    else if (infotype == 'texture') column_info_name = 'mpd';
    return column_info_name;
}

function toKm(val) {
    return new String(new Number(val).toFixed(3)).replace('.', '+');
}

function expcodeToExpressway(expcode) {
    var expstr;
    switch (expcode) {
        case "07":
            expstr = "ทางหลวงพิเศษหมายเลข 7";
            break;
        case "09":
            expstr = "ทางหลวงพิเศษหมายเลข 9";
            break;
    }
    return expstr;
}

function toFullName(code) {
    var fullname = "";
    switch(g_search_info['exptype']) {
        case "1":
            var eachcode = code.split("_");
            var fullname = "ทางหลัก ";
            if (eachcode[1] == "O") fullname += "ฝั่งขาออก";
            else fullname += "ฝั่งขาเข้า";
            switch (eachcode[2]) {
                case "RL":
                    fullname += "ช่องจราจรขวา";
                    break;
                case "ML":
                    fullname += "ช่องจราจรกลาง";
                    break;
                case "LL":
                    fullname += "ช่องจราจรซ้าย";
                    break;
            }
        break;
        case "2":
            var enex_name = $(".enexname option:selected").html();
            fullname = enex_name;
        break;
        case "3": 
            var eachcode = code.split("_");
            var fullname = "ทางเชื่อม ";
            if (eachcode[1] == "O") 
                fullname += "ฝั่งขาออก";
            else 
                fullname += "ฝั่งขาเข้า";
        break;      
        default: 
            fullname = code;
        break;
    }
    return fullname;
}

function toExpressName(section) {
    var str1 = section.substr(0, 2);
    var str = section.substr(0, 2);
    if (str1 == "07") return "ทางหลวงพิเศษหมายเลข 7";
    else return "ทางหลวงพิเศษหมายเลข 9"

}

function getAbbInfoType(infotype) {
    var column_info_name;
    if (infotype == 'roughness') column_info_name = 'IRI';
    else if (infotype == 'rutting') column_info_name = 'Rutting';
    else if (infotype == 'texture') column_info_name = 'MPD';
    return column_info_name;
}

function toDir(lane){
    if(lane.indexOf('F') != -1)
        return 'ขาออก';
    else
        return 'ขาเข้า';
}
