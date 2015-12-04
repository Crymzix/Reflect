var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var gesturesModule = require("ui/gestures");
var loginViewModel = require("../../shared/view-models/login-view-model");
var applicationSettings = require("application-settings");

var user = new loginViewModel.User({ authenticating: false });

var email;
var password;
exports.loaded = function(args){
    console.log("Page loaded");
    var page = args.object;
    page.bindingContext = user;

    email = page.getViewById("email");
    password = page.getViewById("password");

};



exports.logIn = function(args){
    frameModule.topmost().navigate({
        moduleName: "views/login/login-page"
    });
};

exports.register = function(args){
        user.register().then(function() {
            dialogsModule.alert("Sign up Successful!");
            var topmost = frameModule.topmost();
            topmost.navigate("views/login/login-page");
        }).catch(function(e) {
            dialogsModule.alert("Signup failed. Username may be already taken. Please try again.");
        });
};

//var UserViewModel = require("../../shared/view-models/user-view-model");
//var user = new UserViewModel({ authenticating: false });
//
//exports.loaded = function(args) {
//    var page = args.object;
//    page.bindingContext = user;
//
//    // Dismiss the keyboard when the user taps outside of the two textfields
//    var email = page.getViewById("email");
//    var password = page.getViewById("password");
//    page.observe(gesturesModule.GestureTypes.tap, function() {
//        email.dismissSoftInput();
//        password.dismissSoftInput();
//    });
//};
//
//function completeRegistration() {
//    // Don't send off multiple requests at the same time
//    if (user.get("authenticating")) {
//        return;
//    }
//
//    user.set("authenticating", true);
//    user.register()
//        .then(function() {
//            dialogsModule
//                .alert("Your account was successfully created.")
//                .then(function() {
//                    frameModule.topmost().navigate("views/login/login");
//                });
//        }).catch(function() {
//            dialogsModule
//                .alert({
//                    message: "Unfortunately we were unable to create your account.",
//                    okButtonText: "OK"
//                });
//        }).then(function() {
//            user.set("authenticating", false);
//        });
//}
//
//exports.register = function() {
//    if (user.isValidEmail()) {
//        completeRegistration();
//    } else {
//        dialogsModule.alert({
//            message: "Enter a valid email address.",
//            okButtonText: "OK"
//        });
//    }
//};

//user.register();
//if(applicationSettings.hasKey("errorCode")){
//    dialogsModule.alert("Signup failed. Username may be already taken. Please try again.")
//    applicationSettings.remove("errorCode");
//} else {
//    dialogsModule.alert("You've successfully signed up!");
//    var topmost = frameModule.topmost();
//    topmost.navigate("views/login/login-page");
//}