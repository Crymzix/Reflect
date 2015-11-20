/**
 * Created by Vineet on 2015-10-25.
 */
var config = require("../config");
var fetchModule = require("fetch");
var igRest = require("../../helpers/instagram-rest.js");
var observableModule = require("data/observable");
var igAPI = config.instagramAPIURL;
var http = require("http");

var pictures;
var picture;

function Gallery(info){
    info = info || "";

    //var pictures = loadIGPhotos(info.tag, info.eventID);

    loadIGPhotos("iamubc", "event").then(function(response) {
        console.log("In IG Photos promise");
        pictures = response;

        picture = pictures.pop();

        console.log(picture.url);
        viewModel.set("image_url" , picture.url);
        viewModel.set("image_id", picture.id);

    }, function(err){
        console.log(err);
    });

    var viewModel = new observableModule.Observable({
        image_url: "",
        image_id:  ""
    });

    viewModel.visitPhoto = function(){
        console.log("Here");
        //Update visited column in firebase db for event table
        //var visited = eventModel.getVisited(eventID);
        //
        //visited.push(photoID.toString());
        //
        //eventModel.updateVisited(eventID, visited);
    };

    viewModel.swipeLeft = function(){
        console.log("swipe_left");
        picture = pictures.pop();
        viewModel.set("image_url" , picture.url);
        viewModel.set("image_id", picture.id);
    };

    viewModel.swipeRight = function(){
        //Add to event-gallery table
        console.log("swipe_right");
        picture = pictures.pop();
        viewModel.set("image_url" , picture.url);
        viewModel.set("image_id", picture.id);
    };

    return viewModel;

}

// This function takes the a hashtag (string) associated with Event and fills
// global picture array with photos from Instagram that haven't already been visited
function loadIGPhotos (tag, eventID){
    return new Promise(function(resolve, reject){
        searchTags(tag).then(function(response){
            console.log("in_search_tags_promise");
            var jsresp = response;
            var dataJSON = jsresp.data;
            var pictures = [];
            var count = 0;
            console.log(dataJSON.length);
            for( ;count < dataJSON.length; count++){
                console.log("in_loop");
                //Get visited column in event-gallery table
                //var visited = eventModel.getVisited(eventID);
                var id = parseInt(dataJSON[count].id);
                //console.log(dataJSON[count].images.standard_resolution.url);
                //if(findIfVisited(visited, id)){
                // We break here because the photos are in order of newest to oldest
                // So a visited photo would be the newest possible visted photo
                //  break;
                //}
                //console.log(picture.url);
                var pictureDefinition = {
                    "url" : dataJSON[count].images.standard_resolution.url,
                    "id" : id
                };
                pictures[count] = pictureDefinition;
            }
            console.log("out of loop");
            resolve(pictures);

        }, function(err) {
            console.log(err);
            reject("NO PICTURES");
        });
    });
}

// Takes a list of visited photos (JSON Array) and a photo ID (int)
//
// Returns true if ID is in visited photos, else returns false
function findIfVisited(visited, id){
    var isVisited = false;
    for(var picture in visited){
        if(picture.hasOwnProperty(visited)){
            if(parseInt(picture.id) === id){
                isVisited = true;
                break;
            }
        }
    }
    return isVisited;
}

function searchTags(tag){
    return new Promise(function(resolve, reject){
        //var accessToken = appSettings.getString("instagram_access_token");
        var accessToken = "305911773.eaf0871.ebf52d56320d45e8b275fc53f1948129";
        var getURL = igAPI + "v1/tags/" + tag + "/media/recent?access_token=" + accessToken;
        console.log(getURL);
        if (accessToken) {
            console.log("inside_access_token");
            http.getJSON({
                url: getURL,
                method: "GET"
            }).then(function (response) {
                //console.log(JSON.stringify(response));
                //applicationSettings.setString("currentUser",response.objectId);
                resolve(response);
            }, function (e) {
                reject("SEARCHING DIDNT WORK");
            });
        } else {
            reject("couldn't get access token");
        }
    });
}

module.exports = Gallery;