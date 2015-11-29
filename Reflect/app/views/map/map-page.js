var frameModule = require("ui/frame");
var eventObjects;
var locationModule = require("location");
//var locationManager = new locationModule.LocationManager();
var locationOptions = {
    desiredAccuracy: 3,
    updateDistance: 0,
    minimumUpdateTime: 5000,
    maximumAge: 20000
};
var buttonModule = require("ui/button");
var appModule = require("application");
var platformModule = require("platform");

var LocationManager = require("location").LocationManager;
var isEnabled = LocationManager.isEnabled();
var Location = require("location").Location;
var userLocation = new Location();

var LocationManager = require("location").LocationManager;
var locationManager = new LocationManager();

var locationManager = new LocationManager();
locationManager.startLocationMonitoring(function (location) {
    console.log('Location received: ' + location);
}, function (error) {
    console.log('Location error received: ' + error);
});

//var userLocation = locationManager.lastKnownLocation;
userLocation.latitude = 49.2827;
userLocation.longitude = 123.1207;


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
			
			var distance = LocationManager.distance(userLocation, eventObject);
			
			console.log("Distance to events are: " + distance);
			
        }
    }
}
exports.OnMapReady = OnMapReady;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;