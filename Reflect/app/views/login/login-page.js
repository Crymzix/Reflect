var gesturesModule = require("ui/gestures");
var frameModule = require("ui/frame");
var loginViewModel = require("../../shared/view-models/login-view-model");
var dialogsModule = require("ui/dialogs");

var applicationSettings = require("application-settings");


var user = new loginViewModel.User({
    email: "test@hotmail.ca",
    password: "test",
    authenticating: false
});
var email;
var password;
exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;

    email = page.getViewById("email_address");
    password = page.getViewById("password");


    //Dismiss the keyboard when the user taps outside of the two textfields
    page.observe(gesturesModule.GestureTypes.tap, function() {
        email.dismissSoftInput();
        password.dismissSoftInput();
    });
};

exports.signUp = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("views/signup/signup-page");
};

exports.asGuest = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("views/main/main-page");
};

exports.signIn = function(){
    user.signIn().then(function(){
        dialogsModule.alert("You've successfully signed in!");
        var topmost = frameModule.topmost();
        topmost.navigate({
            moduleName: "views/main/main-page",
            clearHistory: true
        });
    }).catch(function(e){
        dialogsModule.alert("Login Failed! Try again");
    });

};


//var dialogsModule = require("ui/dialogs");
//var frameModule = require("ui/frame");
//var gesturesModule = require("ui/gestures");
//var UserViewModel = require("../../shared/view-models/login-view-model");
//
//var user = new UserViewModel({
//    email: "tj.vantoll@gmail.com",
//    password: "password",
//    authenticating: false
//});
//
//exports.loaded = function(args) {
//    var page = args.object;
//
//    // Dismiss the keyboard when the user taps outside of the two textfields
//    var email = page.getViewById("email_address");
//    var password = page.getViewById("password");
//    page.observe(gesturesModule.GestureTypes.tap, function() {
//        email.dismissSoftInput();
//        password.dismissSoftInput();
//    });
//
//    page.bindingContext = user;
//};
//
//exports.signIn = function() {
//    // Don't send off multiple requests at the same time
//    if (user.get("authenticating")) {
//        return;
//    }
//
//    user.set("authenticating", true);
//    user.login()
//        .then(function() {
//            frameModule.topmost().navigate("views/list/list");
//        })
//        .catch(function(error) {
//            console.log(error);
//            dialogsModule.alert({
//                message: "Unfortunately we could not find your account.",
//                okButtonText: "OK"
//            });
//        })
//        .then(function() {
//            user.set("authenticating", false);
//        });
//};
//
//exports.register = function() {
//    var topmost = frameModule.topmost();
//    topmost.navigate("views/signup/signup");
//};
//
//exports.forgotPassword = function() {
//    //var topmost = frameModule.topmost();
//    //topmost.navigate("views/password/password");
//};