var frameModule = require("ui/frame");
var eventObjects;
var markers = [];

var page;

function pageLoaded(args) {
    page = args.object;
    var context = page.navigationContext;
    eventObjects = context["events"];
}
exports.pageLoaded = pageLoaded;

console.log ("my location is: " )
function OnMapReady(args) {
    var mapView = args.object;
    var gMap = mapView.gMap;
    gMap.setMyLocationEnabled(true);

    console.log("Setting markers...");

    if(mapView.android) {
        for (var i = 0; i < eventObjects.length; i++) {
            var markerOptions = new com.google.android.gms.maps.model.MarkerOptions();

            var eventObject = eventObjects[i];

            markerOptions.title(eventObject.locationTitle);
            markerOptions.snippet(eventObject.title);

            var latitude = eventObject.location.latitude;
            var longitude = eventObject.location.longitude;

            var latLng = new com.google.android.gms.maps.model.LatLng(latitude, longitude);
            markerOptions.position(latLng);
            var marker = gMap.addMarker(markerOptions);

            var markerObject = {};
            markerObject["markerId"] = marker.getId();
            markerObject["eventIndex"] = i;
            markers.push(markerObject);
        }
    }

    gMap.setOnInfoWindowClickListener(new com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener({
        onInfoWindowClick: function (marker) {
            for (var j = 0; j < markers.length; j++) {
                if (marker.getId() == markers[j].markerId) {

                    var event = eventObjects[j];
                    event["isOwner"] = false;

                    frameModule.topmost().navigate({
                        moduleName: "views/event/event-page",
                        context: event,
                        backstackVisible: true
                    });
                    break;
                }
            }

        }
    }));

}
exports.OnMapReady = OnMapReady;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;