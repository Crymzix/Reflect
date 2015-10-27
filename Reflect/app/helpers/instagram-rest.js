/**
 * Created by Vineet on 2015-10-21.
 */
var http = require("http");
var config = require("../shared/config.js");
var appSettings = require("application-settings");


var igAPI = config.instagramAPIURL;

var accessToken = appSettings.getString("instagram_access_token");

//Searches Instagram for recent data based on tag in parameter
//Returns JSON Object
function searchTag(tag){
    if(accessToken) {
        http.request({
            url: igAPI + "v1/tags/" + tag + "/media/recent?access_token=" + accessToken,
            method: "GET"
        }).then(function (response) {
            // Argument (response) is HttpResponse!
            if (response.statusCode == 200) {
                return response.content.toJSON();
            } else {
                for (var header in response.headers) {
                    console.log(header + ":" + response.headers[header]);
                }
                return null;
            }

        }, function (e) {
            // Argument (e) is Error!
        });
    }else{
        return null;
    }
}




