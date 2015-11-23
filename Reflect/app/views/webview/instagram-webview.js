/**
 * Created by Vineet on 2015-10-22.
 */
var webViewModule = require("ui/web-view");
var config = require("../../shared/config.js");
var fetchModule = require("fetch");
var frameModule = require("ui/frame");
var appSettings = require("application-settings");

var clientID = config.clientID;
var redirectURI = config.redirectURI;
var instagramAPIURL = config.instagramAPIURL;

//var instagramWebView = new webViewModule.WebView;

function getCodeFromURI(uri){
    var code = uri.split("?code=");
    console.log("Code split 0:" + code[0] + " Code Split 1: " + code[1]);
    return code[1];
}

function getTokenFromURI(uri) {
    var token = uri.split("#access_token=");
    console.log("Code split 0:" + token[0] + " Code Split 1: " + token[1]);
    return token[1];
}


exports.loaded = function(args) {
    var page = args.object;
    var web = page.getViewById("webView");

    web.url =instagramAPIURL + "oauth/authorize/?client_id=" + clientID +
    "&redirect_uri=" + redirectURI + "&response_type=token";
    console.log(instagramAPIURL + "oauth/authorize/?client_id=" + clientID +
    "&redirect_uri=" + redirectURI + "&response_type=token");

    // FOR SOME REASON THE THREE STEP SERVER SIDE PROCESS DOESN'T WORK
    // TODO: Use two step client side process
    web.on(webViewModule.WebView.loadFinishedEvent, function (args) {
        var message;
        var topmost = frameModule.topmost();
        console.log("made it to on function");
        if (!args.error) {
            console.log(args.url);
            if(args.url.indexOf("error") === -1 && args.url.indexOf("instagram") === -1){
                console.log(args.url);
                var token = getTokenFromURI(args.url);
                var navigationEntry = {
                    moduleName: "views/main/main-page",
                    backstackVisible: false
                };
                appSettings.setString("instagram_access_token", token);
                //topmost.navigate(navigationEntry);
                //var apiCode = getCodeFromURI(args.url);
                //console.log("just before fetch");
                //var result;
                //fetchModule.fetch(config.instagramAPIURL + "oauth/access_token/", {
                //    method: "POST",
                //    headers: {
                //        "Content-Type": "application/json"
                //    },
                //    body: JSON.stringify({
                //        client_id: clientID,
                //        client_secret: clientSecret,
                //        grant_type: "authorization_code",
                //        redirect_uri: redirectURI,
                //        code: apiCode
                //    })
                //})
                //    .then(handleErrors)
                //    .then(function(response) {
                //        //Setting shared preferences here
                //        //appSettings.setString("instagram_access_token", response.content.toJSON.access_token)
                //        console.log(JSON.stringify(response));
                //        return(response.content.toJSON());
                //    })
                //    .then(function(data) {
                //        //appSettings.setString("instagram_access_token", response.content.toJSON.access_token)
                //        console.log(data.access_token);
                //    });
            }else{
                message = "ERROR!! ";
            }

            message = message + "Webview finished loading - URL: " + args.url;
        }
        else {
            message = "Error loading " + args.url + ": " + args.error;
        }
        console.log(message);
    });
};

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}



