$(function () {
    $("#placeholder").hide()
    $("#search_hdm4_button").click(function () {
        qtip.removeAllFeatures();
    });
    $(".alert-error").click(function(){
        $(this).remove();
    });
});

var qtip;
var qtippavement;
var map;
var selectController;
var selectControllerPavement;

var init = function () {
// Get rid of address bar on iphone/ipod
var fixSize = function() {
    window.scrollTo(0,0);
    document.body.style.height = '100%';
    if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
        if (document.body.parentNode) {
            document.body.parentNode.style.height = '100%';
        }
    }
};
setTimeout(fixSize, 700);
setTimeout(fixSize, 1500);

var lon = 100.7500;
var lat = 13.7500;
var zoom = 10;
var pureCoverage = false;
var format = 'image/png';
var options = {
    projection: new OpenLayers.Projection("EPSG:900913"),
    displayProjection: new OpenLayers.Projection("EPSG:4326"),
    units: "m",
    maxResolution: 156543.0339,
    maxExtent: new OpenLayers.Bounds(-20037508.34, - 20037508.34,
    20037508.34, 20037508.34),
    numZoomLevels: 19,
    wrapDateLine: false,
    controls: [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
        new OpenLayers.Control.Zoom()
        //new OpenLayers.Control.MousePosition()
    ],
    center: new OpenLayers.LonLat(lon,lat),
    zoom:zoom
};

map = new OpenLayers.Map('map', options);

// GEOLOCATION

var geoStyle = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

var pulsate = function(feature) {
    var point = feature.geometry.getCentroid(),
        bounds = feature.geometry.getBounds(),
        radius = Math.abs((bounds.right - bounds.left)/2),
        count = 0,
        grow = 'up';

    var resize = function(){
        if (count>16) {
            clearInterval(window.resizeInterval);
        }
        var interval = radius * 0.03;
        var ratio = interval/radius;
        switch(count) {
            case 4:
            case 12:
                grow = 'down'; break;
            case 8:
                grow = 'up'; break;
        }
        if (grow!=='up') {
            ratio = - Math.abs(ratio);
        }
        feature.geometry.resize(1+ratio, point);
        gl_vector.drawFeature(feature);
        count++;
    };
    window.resizeInterval = window.setInterval(resize, 50, point, radius);
};

var gl_vector = new OpenLayers.Layer.Vector('GeoLocation Mark');
var geolocate = new OpenLayers.Control.Geolocate({
    bind: false,
    geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    }
});
map.addControl(geolocate);
var firstGeolocation = true;
geolocate.events.register("locationupdated",geolocate,function(e) {
    gl_vector.removeAllFeatures();
    var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
            e.position.coords.accuracy/2,
            40,
            0
        ),
        {},
        geoStyle
    );
    
    gl_vector.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    ]);
    if (firstGeolocation) {
        map.zoomToExtent(gl_vector.getDataExtent());
        pulsate(circle);
        firstGeolocation = false;
        this.bind = true;
    }
    var convertedPts = e.point;
    convertedPts.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
    
    //call controller function
    controller.getGeolocation(convertedPts.x,convertedPts.y);
});
geolocate.events.register("locationfailed",this,function() {
    OpenLayers.Console.log('Location detection failed');
});

$('.geolocation_type li').live('click',function() {
    gl_vector.removeAllFeatures();
    geolocate.deactivate();
   // document.getElementById('track').checked = false;
    geolocate.watch = false;
    firstGeolocation = true;
    geolocate.activate();
});

// END GEOLOCATION


        

var centerline = new OpenLayers.Layer.Vector("Centerline MOTORWAY", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/centerline.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var begin = new OpenLayers.Layer.Vector("begin", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/asset/begin.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var end = new OpenLayers.Layer.Vector("end", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/asset/end.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var style2 = new OpenLayers.Style({
                pointRadius: 5,
                fillColor: "#252525",
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWidth: 2,
                strokeOpacity: 0.8
            }, {
                context: {
                    radius: function(feature) {
                        return Math.min(feature.attributes.count, 7) + 3;
                    },
                }
            });

var kilostone = new OpenLayers.Layer.Vector("kilostone", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/asset/kilostone.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    }),
    styleMap: new OpenLayers.StyleMap({
                        "default": style2,
                        "select": {
                            fillColor: "#8aeeef",
                            strokeColor: "#32a8a9"
                        }
                })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var overhead = new OpenLayers.Layer.Vector("overhead", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/asset/overhead.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var plaza = new OpenLayers.Layer.Vector("plaza", {
    //Set your projection and strategies//
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    //set the protocol with a url//
    protocol: new OpenLayers.Protocol.HTTP({
        //set the url to your variable//
        url: "kml/asset/plaza.kml",
        //format this layer as KML//
        format: new OpenLayers.Format.KML({
            //maxDepth is how deep it will follow network links//
            maxDepth: 1,
            //extract styles from the KML Layer//
            extractStyles: true,
            //extract attributes from the KML Layer//
            extractAttributes: true
        })
    })
}, {

    buffer: 1,
    visibility: false,

    displayOutsideMaxExtent: true,

    isBaseLayer: false

});

var feature;
var colors = ["#00bb00", "#ffcc00", "#dc0000", "#0000ff", "#252525"];
var context = {
    getColor: function (feature) {
        var c_var = feature.attributes['var'];
        if(c_var == null)
            var hdm4_cond = '';
        else
            var hdm4_cond = c_var.substr(0, 4);
        var c_cond = $("[name='infotype']:checked").val();
        var sec = feature.attributes['section'];
        //console.log(sec + " " + hdm4_cond);
        if (hdm4_cond == "RM00") {
            region = 0;
        } else if (hdm4_cond == "SS02") {
            region = 1;
        } else if (hdm4_cond == "RP05") {
            region = 2;
        } else if (hdm4_cond == "RP04") {
            region = 3;
        } else if (hdm4_cond == "RP08") {
            region = 4;
        }
        if (c_cond == "roughness") {
            if (c_var < 2.68) {
                var region = 0;
            } else if (c_var >= 2.68 && c_var < 3.5) {
                var region = 1;
            } else if (c_var >= 3.5) {
                var region = 2;
            }
        } else if (c_cond == "rutting") {
            var region = 0;
        } else if (c_cond == "texture") {
            //var region = 0;

            if (c_var > 0.3) {
                var region = 0;
            } else if (c_var <= 0.3) {
                var region = 2;
            }

        }
        return colors[region];
    },
    getSize: function (feature) {
        return 6;
    }
};

var context_hdm4 = {
    getColor: function (feature) {
        var c_var = feature.attributes['var'];
        var sec = feature.attributes['section'];
        //console.log(c_var);
        var cond = c_var.substr(0, 4);
        if (sec.substr(0, 2) != "01") {
            if (cond == "RM00") {
                region = 0;
            } else if (cond == "SS02") {
                region = 1;
            } else if (cond == "RP05") {
                region = 2;
            }
        } else {
            if (cond == "RP04") {
                region = 3;
            } else if (cond == "RP08") {
                region = 4;
            }
        }
        return colors[region];
    },
    getSize: function (feature) {
        return 3;
    }
};

var colorsPavement = ["#FFFFFF","#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#6600FF","#8B00FF"];

var contextPavement = {
    getColor: function (feature) {
        var c_var = feature.attributes['var'];
        var sec = feature.attributes['section'];

        if(feature.attributes['crack_aca'] != 0) {
            region = 1;
        } else if(feature.attributes['crack_act'] != 0) {
            region = 2;
        } else if(feature.attributes['bleeding'] != 0) {
            region = 3;
        } else if(feature.attributes['raveling'] != 0) {
            region = 4;
        } else if(feature.attributes['phole'] != 0) {
            region = 5;
        } else if(feature.attributes['deformation'] != 0) {
            region = 6;
        } else if(feature.attributes['patching'] != 0) {
            region = 7;
        }

        return colorsPavement[region];
    },
    getSize: function (feature) {
        return 3;
    }
}

var template = {
    pointRadius: "${getSize}", // using context.getSize(feature)
    fillColor: "${getColor}", // using context.getColor(feature)
    fillOpacity: 0.5,
    stroke: true,
    strokeColor: "${getColor}",
    strokeWidth: 1,
};

var templatePavement = {
    pointRadius: "${getSize}", // using context.getSize(feature)
    fillColor: "${getColor}", // using context.getColor(feature)
    fillOpacity: 0.5,
    stroke: true,
    strokeColor: "${getColor}",
    strokeWidth: 1,
};

var style = new OpenLayers.Style(template, {
    context: context
});

var stylePavement = new OpenLayers.Style(templatePavement, {
    context: contextPavement
});

var defStyle = {
    strokeColor: "blue",
    strokeOpacity: "0.7",
    strokeWidth: 3,
    cursor: "pointer"
};
var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);

var sm = new OpenLayers.StyleMap({
    'default': style,
    'select': {
        strokeColor: "blue",
        strokeWidth: 2,
        cursor: "pointer",
        fillColor: "blue",
        fillOpacity: 0.3
    }
});

var smPavement = new OpenLayers.StyleMap({
    'default': stylePavement,
    'select': {
        strokeColor: "blue",
        strokeWidth: 2,
        cursor: "pointer",
        fillColor: "blue",
        fillOpacity: 0.3
    }
});

qtip = new OpenLayers.Layer.Vector('IRI - Rutting - Texture', {
    //styleMap: new OpenLayers.StyleMap(style)
    styleMap: sm,
    numZoomLevels: null, minZoomLevel: 12, maxZoomLevel: 19 
});

qtipPavement = new OpenLayers.Layer.Vector('Distress', {
    //styleMap: new OpenLayers.StyleMap(style)
    styleMap: smPavement,
    numZoomLevels: null, minZoomLevel: 12, maxZoomLevel: 19 
});


selectController = new OpenLayers.Control.SelectFeature([qtip], {
    clickout: true,
    toggle: false,
    multiple: false,
    hover: false,
    highlightOnly: true,
    toggleKey: "ctrlKey", // ctrl key removes from selection
    multipleKey: "shiftKey", // shift key adds to selection
    eventListeners: {
        beforefeaturehighlighted: showQtip,
        featurehighlighted: showQtip,
        featureunhighlighted: hl,
        //featureselected: hl,
        //featureunselected: showStatus
    }
});

selectControllerPavement = new OpenLayers.Control.SelectFeature([qtipPavement], {
    clickout: true,
    toggle: false,
    multiple: false,
    hover: false,
    highlightOnly: true,
    toggleKey: "ctrlKey", // ctrl key removes from selection
    multipleKey: "shiftKey", // shift key adds to selection
    eventListeners: {
        beforefeaturehighlighted: showQtipPavement,
        featurehighlighted: showQtipPavement,
        featureunhighlighted: hl,
        //featureselected: hl,
        //featureunselected: showStatus
    }
});



var hl = function (e) {
    //console.log("hl:" + e.feature.id);
};

map.addLayers([qtip,qtipPavement,gl_vector]);
map.addControl(selectController);
map.addControl(selectControllerPavement);
selectController.activate();


var longdo = new OpenLayers.Layer.TMS("Longdo Map", "http://ms.longdo.com/mmmap/tile.php", {
    layername: 'gray',
    type: 'png',
    'getURL': get_longdo_url,
    proj: 'epsg3857',
    sphericalMercator: true
});

var gmap = new OpenLayers.Layer.Google("Google Streets", {}
// default type, no change needed here
);

var gphy = new OpenLayers.Layer.Google("Google Physical", {
    numZoomLevels: 15,
    type: google.maps.MapTypeId.TERRAIN
}
// used to be {type: G_PHYSICAL_MAP}
);

var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
    type: google.maps.MapTypeId.HYBRID,
}
// used to be {type: G_HYBRID_MAP, numZoomLevels: 20}
);
var gsat = new OpenLayers.Layer.Google("Google Satellite", {
    type: google.maps.MapTypeId.SATELLITE,
}
// used to be {type: G_SATELLITE_MAP, numZoomLevels: 22}
);
var mapnik = new OpenLayers.Layer.OSM();

 map.addLayers([
 gsat, gmap, gphy, ghyb, 
 longdo, centerline
//,begin
//,end
//,overhead
//,plaza
//,kilostone
//,chainage
//,trafficsign
]);



map.addControl(new OpenLayers.Control.LayerSwitcher());

map.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), 9);

//map.zoomToMaxExtent();    

}

function get_longdo_url(bounds) {

    // example http://ms.longdo.com/mmmap/tile.php?zoom=8&x=199&y=117&mode=icons&key=demokeyfortestingonly&proj=epsg3857

    var res = this.map.getResolution();

    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));

    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));

    var z = this.map.getZoom();



    var zoom = z;

    if (this.proj && this.proj == "epsg4326") zoom += 1;

    var path = "?zoom=" + zoom + "&x=" + x + "&y=" + y + "&mode=" + this.layername + "&key=demokeyfortestingonly";

    if (this.proj) path += '&proj=' + this.proj;



    var url = this.url;

    if (url instanceof Array) {

        url = this.selectUrl(path, url);

    }

    return url + path;

}

function zoomMap(s) {

    if (s != null) {

        var re = /^POLYGON\(\(/;

        var minLon = 100000,
            maxLon = -100000,
            minLat = 100000,
            maxLat = -100000;

        if (s.match(re)) {

            var t = s.substr(9, s.length - 11);

            var arr1 = t.split(',');

            for (var i = 0; i < arr1.length; i++) {

                var u = arr1[i];

                var arr2 = u.split(' ');


                var lon = parseFloat(arr2[0]);

                var lat = parseFloat(arr2[1]);

                if (minLon > lon)

                minLon = lon;

                if (maxLon < lon)

                maxLon = lon;

                if (minLat > lat)

                minLat = lat;

                if (maxLat < lat)

                maxLat = lat;

            }

            b = new OpenLayers.Bounds(minLon, minLat, maxLon, maxLat);

            b.transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());

            this.map.zoomToExtent(b);

        }

    }

}

function addPoints(all_result) {
    selectController.activate();
    selectControllerPavement.deactivate();
    $.each(all_result, function (index, value) {

        var cost;
        var workdes;
        var year;

    cost = '';
    workdes = '';
    year = '';

        var feature = poi(index, value['lat'], value['long'], value['subdistance'], value['iri_avg'], value['rut_lane'], value['mpd'], value['code'], value['section'], cost, workdes, year);
        qtip.addFeatures(feature);
        if (index == all_result['usedlength']) return false;
    });
}

function addPointsPavement(all_result) {
    selectController.deactivate();
    selectControllerPavement.activate();
     $.each(all_result, function (index, value) {
        //console.log(value);
        var feature = poiPavement(index, value['lat'], value['long'], value['sta'], value['crack_aca'], value['crack_act'], 
            value['bleeding'], value['raveling'], value['phole'], value['deformation'], value['pacthing']);
        qtipPavement.addFeatures(feature);
     });
}

function showQtipPavement(olEvent) {
    var elem = document.getElementById(olEvent.feature.geometry.id);
    var data = olEvent.feature.data;
    var ol = olEvent;

    var qcolor = "plain";    
    var c_var = "";
    var columns = ['','รอยแตกหนังจระเข้','รอยแตกตามยาว','รอยร่องล้อ','ผิวหลุดร่อน','หลุม บ่อ','ผิวยุบตัวเป็นแอ่ง','ปะซ่อมผิว'];
     
    
    if(data['crack_aca'] != 0) {
            c_var += columns[1] + ": " + data['crack_aca'] + " ตร.ม.";
        } else if(data['crack_act'] != 0) {
            c_var += columns[2] + ": " + data['crack_act'] + " ตร.ม.";
        } else if(data['bleeding'] != 0) {
            c_var += columns[3] + ": " + data['bleeding'] + " ตร.ม.";
        } else if(data['raveling'] != 0) {
            c_var += columns[4] + ": " + data['raveling'] + " ตร.ม.";
        } else if(data['phole'] != 0) {
            c_var += columns[5] + ": " + data['phole'] + " ตร.ม.";
        } else if(data['deformation'] != 0) {
            c_var += columns[6] + ": " + data['deformation'] + " ตร.ม.";
        } else if(data['patching'] != 0) {
            c_var += columns[7] + ": " + data['pacthing'] + " ตร.ม.";
        }

        console.log(data);

    $(elem).qtip({
        overwrite: true,
        content: {
            title: {
                text: "<span class='etitle'>" + data['ename'] + "</span>" + "<br/>" + "<span class='edesc'>[" + data['code'] + "]</span>"
            },
            text: c_var + "<br/>KM: " + data['km_at'] + "<br />" + "Lat: " + data['latitude'] + "<br />" + "Long: " + data['longitude'],
            button: 'Close'
        },
        style: {
            classes: 'ui-tooltip-' + qcolor + ' ui-tooltip-shadow myqtip'
        },
        position: {
            adjust: {
                x: 0,
                y: -15
            },
            my: 'bottom center', // Position my top left...
            at: 'bottom center' // at the bottom right of...
        },
        show: {
            ready: true,
        },
        hide: {
            event: 'unfocus',
            target: $(this)
        },
        events: {
            show: function () {
                $(document).one("click", function () {
                    $(".qtip").qtip('hide');
                });
            }
        }
    });
    //.qtip('show');
    map.layers[0].redraw();
}

function showQtip(olEvent) {
    var elem = document.getElementById(olEvent.feature.geometry.id);
    var data = olEvent.feature.data;
    var ol = olEvent;
    var c_var = "";
    var qcolor = "green";
    var c_cond = $("[name='infotype']:checked").val();
    var year = parseInt(data['year']);
    if (g_hdm4search_click) {
        c_var = "แผนการซ่อม: " + data['workdes'] + "<br/>" + "งบประมาณ: " + data['cost'] + " ลบ. (ปี " + year + ")<br/>" + "IRI: " + data['iri'] + "<br/>" + "Rutting: " + data['rutting'] + "<br/>" + "MPD: " + data['texture'] + "<br/>";

    } else if (c_cond == "roughness") {
        c_var = "IRI: " + data['var'];
        if (data['var'] < 2.68) {
            qcolor = "green";
        } else if (data['var'] >= 2.68 && data['var'] < 3.5) {
            qcolor = "plain";
        } else if (data['var'] >= 3.5) {
            qcolor = "red";
        }
    } else if (c_cond == "rutting") {
        c_var = "Rutting: " + data['var'];
    } else if (c_cond == "texture") {
        c_var = "MPD: " + data['var'];
        if (data['var'] < 0.3) {
            qcolor = "red";
        } else if (data['var'] >= 0.3) {
            qcolor = "green";
        }
    }
    $(elem).qtip({
        overwrite: true,
        content: {
            title: {
                text: "<span class='etitle'>" + data['ename'] + "</span>" + "<br/>" + "<span class='edesc'>[" + data['code'] + "]</span>"
            },
            text: c_var + "<br />" + "KM: " + data['km_at'] + "<br />" + "Lat: " + data['latitude'] + "<br />" + "Long: " + data['longitude'],
            button: 'Close'
        },
        style: {
            classes: 'ui-tooltip-' + qcolor + ' ui-tooltip-shadow myqtip'
        },
        position: {
            adjust: {
                x: 0,
                y: -15
            },
            my: 'bottom center', // Position my top left...
            at: 'bottom center' // at the bottom right of...
        },
        show: {
            ready: true,
        },
        hide: {
            event: 'unfocus',
            target: $(this)
        },
        events: {
            show: function () {
                $(document).one("click", function () {
                    $(".qtip").qtip('hide');
                });
            }
        }
    });
    //.qtip('show');
    map.layers[0].redraw();
}

function poiPavement(item, lat, long, sta, crack_aca, crack_act, bleeding, raveling, phole, deformation, pacthing) {
    var fpoint = new OpenLayers.Geometry.Point(long, lat).transform(
    new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    var names = getNames();
    var mname = names[0];
    var sname = names[1];
    var attributes = {
            'name': item,
            'km_at': sta,
            'longitude': long,
            'latitude': lat,
            'code': sname,
            'ename': mname,
            'crack_aca': crack_aca,
            'crack_act': crack_act,
            'bleeding': bleeding,
            'raveling': raveling,
            'phole': phole,
            'deformation': deformation,
            'pacthing': pacthing,
        };
    var feature = new OpenLayers.Feature.Vector(fpoint, attributes);
    feature.id = "POI_" + item;
    return feature;
}

function getNames(){
    var mname = $('.expressway option:selected').html();
    var sname = ''
    if($("[name='exptype']").val() == "1") {
        $.each($('#option1 select'),function(){
            if($(this).css("display") != 'none') {
                sname += "" + $(this).find('option:selected').html();
            }
        })
        
    } else {
        $.each($('#option2 select'),function(){
            if($(this).css("display") != 'none') {
                sname += $(this).find("option:selected").html();
            }
        })
    }
    var a = [];
    a[0] = mname;
    a[1] = sname;
    return a;     
}

function poi(item, lat, long, km_at, iri, rutting, texture, code, section, cost, workdes, year) {
    var fpoint = new OpenLayers.Geometry.Point(long, lat).transform(
    new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());

    var names = getNames();
    var mname = names[0];
    var sname = names[1];

    var c_cond = $("[name='infotype']").val();

    if (c_cond == "roughness") {
        var attributes = {
            'name': item,
            'km_at': km_at,
            'longitude': long,
            'latitude': lat,
            'var': iri,
            'code': sname,
            'ename': mname,
            'section': section,
            'cost': cost,
            'workdes': workdes,
            'year': year
        };
    } else if (c_cond == "rutting") {
        var attributes = {
            'name': item,
            'km_at': km_at,
            'longitude': long,
            'latitude': lat,
            'var': rutting,
            'code': sname,
            'ename': mname,
            'section': section,
            'cost': cost,
            'workdes': workdes,
            'year': year
        };
    } else if (c_cond == "texture") {
        var attributes = {
            'name': item,
            'km_at': km_at,
            'longitude': long,
            'latitude': lat,
            'var': texture,
            'code': sname,
            'ename': mname,
            'section': section,
            'cost': cost,
            'workdes': workdes,
            'year': year
        };
    } 
    var feature = new OpenLayers.Feature.Vector(fpoint, attributes);
    feature.id = "POI_" + item;
    return feature;
};

function zoomCoor() {
    var section = $('.expressway option:selected').val();
    if($("[name='exptype']").val() == "1") {
        $.each($('#option1 select'),function(){
            if($(this).css("display") != 'none') {
                 section += $(this).find('option:selected').val();
            }
        })
    } else {
        $.each($('#option2 select'),function(){
            if($(this).css("display") != 'none') {
                section += $(this).find("option:selected").val();
            }
        })
    }
    section += "%";

    
    //console.log(section);

    $.ajax({
        url: 'ajax/_geo.php',
        type: 'GET',
        data: {
            expressway: g_search_info.expressway, //only value number of expressway are sent.
            kmstart: g_search_info.kmstart,
            kmend: g_search_info.kmend,
            infotype: g_search_info['infotype'],
            exptype: g_search_info['exptype'],
            searchtype: g_search_info['searchtype'],
            section: g_search_info_level2['currentsection']
        },
        dataType: 'jsonp',
        dataCharset: 'jsonp',
        success: function (data) {
            zoomMap(data[0].geo);
        }
    });
}

function getFeatureIndexById(featureId) {
    var objFs = qtip.features;
    var idx;
    for (var i = 0; i < objFs.length; ++i) {
        if (objFs[i].id == featureId) {
            idx = i;
            break;
        }
    }
    return idx;
}

function selectMapPoint(index) {
    selectController.unselectAll();
    selectController.select(map.layers[0].features[index]);
}