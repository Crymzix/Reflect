var application = require("application");
var frameModule = require("ui/frame");

exports.loaded = function (args) {
    var page = args.object;
    com.firebase.client.Firebase.setAndroidContext(application.android.context.getApplicationContext());
    var firebase = new com.firebase.client.Firebase("https://reflect-cpsc410.firebaseio.com/");
    firebase.addAuthStateListener( new com.firebase.client.Firebase.AuthStateListener({
        onAuthStateChanged: function(authData){
            if (authData != null) {
                console.log("Logged in");
                setTimeout(function() {
                    frameModule.topmost().navigate({
                        moduleName: "views/main/main-page",
                        backstackVisible: false
                    });
                }, 3000);
            } else {
                console.log("Not logged in");
                setTimeout(function() {
                    frameModule.topmost().navigate({
                        moduleName: "views/main/main-page",
                        backstackVisible: false
                    });
                }, 3000);
            }
        }
    }));

    var authData = firebase.getAuth();
    if (authData != null) {
        console.log("The state is: " + authData);
    } else {
        console.log("No authentication data.");
    }
};
