var application = require("application");
application.mainModule = "views/dispatch/dispatch-page";
application.cssFile = "./app.css";

if (application.android) {

    application.android.on(application.AndroidApplication.activityCreatedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity + ", Bundle: " + args.bundle);
        com.firebase.client.Firebase.setAndroidContext(application.android.context.getApplicationContext());
        var firebase = new com.firebase.client.Firebase("https://reflect-cpsc410.firebaseio.com/");
        firebase.addAuthStateListener( new com.firebase.client.Firebase.AuthStateListener({
               onAuthStateChanged: function(authData){
                   if (authData != null) {
                       console.log("Event: " + args.eventName + ", Activity: " + args.activity + " Logged in");
                   } else {
                       console.log("Event: " + args.eventName + ", Activity: " + args.activity + " Not logged in");
                   }
               }
        }));

        var authData = firebase.getAuth();
        if (authData != null) {
            console.log("The state is: " + authData);
        } else {
            console.log("No authentication data.");
        }

    });

    application.android.on(application.AndroidApplication.activityDestroyedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    });

    application.android.on(application.AndroidApplication.activityStartedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    });

    application.android.on(application.AndroidApplication.activityPausedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    });

    application.android.on(application.AndroidApplication.activityResumedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    });

    application.android.on(application.AndroidApplication.activityStoppedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    });

    application.android.on(application.AndroidApplication.saveActivityStateEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity + ", Bundle: " + args.bundle);
    });

    application.android.on(application.AndroidApplication.activityResultEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity +
            ", requestCode: " + args.requestCode + ", resultCode: " + args.resultCode + ", Intent: " + args.intent);
    });

    application.android.on(application.AndroidApplication.activityBackPressedEvent, function (args) {
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
        // Set args.cancel = true to cancel back navigation and do something custom.
    });
}

application.start();
