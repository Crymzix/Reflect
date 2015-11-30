var frameModule = require("ui/frame");
var eventObjects;

function pageLoaded(args) {
    page = args.object;
    var context = page.navigationContext;
    eventObjects = context["events"];
}
exports.pageLoaded = pageLoaded;

function OnMapReady(args) {
    var mapView = args.object;
    var gMap = mapView.gMap;

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
            gMap.addMarker(markerOptions);
            gMap.setMyLocationEnabled(true);
        }
    }
}
exports.OnMapReady = OnMapReady;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;