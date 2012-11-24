<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>OSM - Dynamic POI update</title>
    <style type="text/css">
#map {
        width: 100%;
        height: 100%;
        border: 0px;
        padding: 0px;
        position: absolute;
     }
body {
        border: 0px;
        margin: 0px;
        padding: 0px;
        height: 100%;
     }
    </style>
    <script src="../../js/openlayer/lib/OpenLayers.js"></script>
    <script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
    <script type="text/javascript">
 
OpenLayers.Layer.OSM.NLMapnik = OpenLayers.Class(OpenLayers.Layer.OSM, {
    /**
     * Constructor: OpenLayers.Layer.OSM.NLMapnik
     *
     * Parameters:
     * name - {String}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {
        var url = [
            "http://c.tile.openstreetmap.nl/tilecache.py/1.0.0/mapnik/",
            "http://a.tile.openstreetmap.nl/tilecache.py/1.0.0/mapnik/"
        ];
        options = OpenLayers.Util.extend({ numZoomLevels: 19 }, options);
        var newArguments = [name, url, options];
        OpenLayers.Layer.OSM.prototype.initialize.apply(this, newArguments);
    },
 
    CLASS_NAME: "OpenLayers.Layer.OSM.NLMapnik"
});
 
 
        var map;
	var POI;
	get_string = location.search;
 
	var features = "2:3;1:1;1:2;2:4;5:17;5:18;3:8;3:9;3:10";
 
        function init(){
            map = new OpenLayers.Map('map',
                    { maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                      numZoomLevels: 19,
                      maxResolution: 156543.0399,
                      units: 'm',
                      projection: new OpenLayers.Projection("EPSG:900913"),
                      displayProjection: new OpenLayers.Projection("EPSG:4326")
                    });
 
            var layerNLMapnik = new OpenLayers.Layer.OSM.NLMapnik("NL Mapnik (updated weekly)");
 
            var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik (updated weekly)");
 
	    var colors = ["black", "blue", "green", "red"];
 
	    var style = new OpenLayers.Style({
                pointRadius: "${radius}",
                fillColor: "red",
                fillOpacity: 0.8,
                strokeColor: "#ff5555",
                strokeWidth: 2,
                strokeOpacity: 0.8
            }, {
                context: {
                    radius: function(feature) {
			return Math.min(feature.attributes.count, 7) + 3;
                    },
                }
            });
 
	    var pois = new OpenLayers.Layer.Vector("POI", {
		projection: new OpenLayers.Projection("EPSG:4326"),
		strategies: [
			new OpenLayers.Strategy.BBOX(),
			new OpenLayers.Strategy.Cluster()
		],

		protocol: new OpenLayers.Protocol.HTTP({
                        url: "kilostone.kml",  //Note that it is probably worth adding a Math.random() on the end of the URL to stop caching.
			format: new OpenLayers.Format.KML({
                                extractStyles: true, 
                                extractAttributes: true
                        }),
		}),
		styleMap: new OpenLayers.StyleMap({
                        "default": style,
                        "select": {
                            fillColor: "#8aeeef",
                            strokeColor: "#32a8a9"
                        }
                })
	    });
 
            map.addLayer(layerMapnik);
	   // map.addLayer(layerTah);
	    map.addLayer(layerNLMapnik);
 
	    map.addLayer(pois);
 
	selectControl = new OpenLayers.Control.SelectFeature(map.layers[2],
                {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
 
	<?php
	$lon = 5.73334;
	$lat = 52.25;
	$zoom = 9;
	if (isset($_GET['lon'])) { $lon = $_GET['lon'];}
	if (isset($_GET['lat'])) { $lat = $_GET['lat'];}
	if (isset($_GET['zoom'])) { $zoom = $_GET['zoom'];}
 
        printf("var centre = new OpenLayers.LonLat(%s, %s);\n", $lon, $lat);
        printf("var zoom = %s;\n", $zoom);
?>
 
 
 
            map.addControl(new OpenLayers.Control.LayerSwitcher());
	    map.addControl(new OpenLayers.Control.Permalink());
	    map.addControl(selectControl);
	    selectControl.activate();
 
	    map.setCenter(centre.transform(map.displayProjection,map.projection), zoom);
        }
        function onPopupClose(evt) {
            selectControl.unselect(selectedFeature);
        }
 
        function onFeatureSelect(feature) {
            selectedFeature = feature;
	    text = '';
	    for (var i in feature.cluster){
		var feat = feature.cluster[i];
		text += '<h3>'+feat.attributes.name + "</a></h3><div>" + feat.attributes.name + "</div><br />";
	    }
            popup = new OpenLayers.Popup("chicken", 
                                     feature.geometry.getBounds().getCenterLonLat(),
                                     null,
                                     text,
                                     true, onPopupClose);
            feature.popup = popup;
	    popup.setOpacity(0.7);
            map.addPopup(popup);
        }
 
        function onFeatureUnselect(feature) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        }
 
        // -->
    </script>
  </head>
  <body onload="init()">
    <div id="map"></div>
  </body>
</html>