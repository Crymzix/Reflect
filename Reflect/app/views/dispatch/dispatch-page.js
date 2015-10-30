var application = require("application");
var frameModule = require("ui/frame");

exports.loaded = function (args) {
    var page = args.object;

    com.parse.Parse.enableLocalDatastore(application.android.context.getApplicationContext());
    com.parse.Parse.initialize(application.android.context.getApplicationContext(), "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp", "7o6dCrStiBi6eDhtMHy0auDdzcrhO28rx1bJ9xDk");

    if (com.parse.ParseUser.getCurrentUser() != null) {
        setTimeout(function() {
            console.log("User logged in");
            frameModule.topmost().navigate({
                moduleName: "views/main/main-page",
                backstackVisible: false
            });
        }, 2000);
    } else {
        console.log("User not logged in");
        setTimeout(function() {
            frameModule.topmost().navigate({
                moduleName: "views/main/main-page",
                backstackVisible: true
            });
        }, 2000);
    }
};
