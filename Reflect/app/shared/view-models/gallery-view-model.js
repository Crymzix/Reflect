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
var eventObject;
var eventInfo;
var visitedPhotos;
var paginationUrl;

var viewModel;

function Gallery(info){
    eventInfo = info || "";
    var hashtags = getListOfHashtags(eventInfo.hashtags);

    visitedPhotos = JSON.parse(eventInfo.viewedPhotos);

    paginationUrl = eventInfo.curIGUrl;

    loadPhotos(hashtags, "eventId", paginationUrl);

    eventObject = com.parse.ParseObject.createWithoutData("Event", eventInfo.objectId);
    try {
        eventObject = eventObject.fetchIfNeeded();
        //Can't do this because loading photos is trying to read from visitedPhotos at the same time this is being
        // set from Parse
        //visitedPhotos = eventObject.get("viewedPhotos");
    } catch(e){
        console.log(e);
    }


    viewModel = new observableModule.Observable({
        image_url: "",
        image_id:  ""
    });

    viewModel.visitPhoto = function(){
        console.log("Visit Photo");

        visitPhoto(picture.id, picture.isUploaded);

    };

    viewModel.swipeLeft = function(){
        console.log("swipe_left");
        picture = pictures.pop();
        if(picture){
            viewModel.set("image_url" , picture.url);
            viewModel.set("image_id", picture.id);
        }else if(paginationUrl) {
            eventInfo.curIGUrl = paginationUrl;
            eventObject.put("curIGUrl", paginationUrl);
            eventObject.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    console.log("new pagination link added for instagram");
                    loadPhotos(hashtags, "eventId", paginationUrl);
                }
            }));
        }else{
            //set photo to NO MORE PHOTOS;
        }
    };

    viewModel.swipeRight = function(){
        //Add to event-gallery table
        console.log("swipe_right");
        picture = pictures.pop();
        if(picture){
            viewModel.set("image_url" , picture.url);
            viewModel.set("image_id", picture.id);
        }else if(paginationUrl) {
            eventInfo.curIGUrl = paginationUrl;
            eventObject.put("curIGUrl", paginationUrl);
            eventObject.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    console.log("new pagination link added for instagram");
                    loadPhotos(hashtags, "eventId", paginationUrl);
                }
            }));
        }else{
            //set photo to NO MORE PHOTOS;
        }

    };

    viewModel.reportPicture = function(){
        // TODO ip addresses
        var reportedPhoto = new com.parse.ParseObject("ReportedPhotos");
        reportedPhoto.put("img_url",picture.url);
        reportedPhoto.saveInBackground(new com.parse.SaveCallback({
            done: function(error){
                console.log("Reported photo saved");
            }
        }));
        picture = pictures.pop();
        if(picture){
            viewModel.set("image_url" , picture.url);
            viewModel.set("image_id", picture.id);

        }
    };

    return viewModel;

}

function loadPhotos(tag, eventId, url){
    loadIGPhotos(tag, "event", url).then(function (response) {
        console.log("In IG Photos promise");
        pictures = response;

        picture = pictures.pop();

        console.log(picture.url);
        viewModel.set("image_url", picture.url);
        viewModel.set("image_id", picture.id);

    }, function (err) {
        console.log(err);
    });
}

// This function takes the a hashtag (string) associated with Event and fills
// global picture array with photos from Instagram that haven't already been visited
function loadIGPhotos (tags, eventID, url){
    return new Promise(function(resolve, reject){
        searchTags(tags, url).then(function(response){
            console.log("in_search_tags_promise");
            var count = 0;
            var jsresp = response;
            var dataJSON = jsresp.data;
            paginationUrl = jsresp.pagination.next_url;
            var pictures = [];
            console.log(dataJSON.length);
            for (var i = 0; i < dataJSON.length; i++) {
                console.log("in_loop");
                //Get visited column in event-gallery table
                //var visited = eventModel.getVisited(eventID);
                var id = parseInt(dataJSON[count].id);
                //console.log(dataJSON[count].images.standard_resolution.url);
                if(findIfVisited(id)){
                    //  do nothing;
                    console.log(id);
                }else {
                    var pictureDefinition = {
                        "url": dataJSON[count].images.standard_resolution.url,
                        "id": id,
                        "isUploaded" : 0
                    };
                    pictures[count] = pictureDefinition;
                    count++;
                }
            }
            console.log("out of loop");
            resolve(pictures);

        }, function(err) {
            console.log(err);
            reject("NO PICTURES");
        });
    });
}

function visitPhoto(id , uploaded){
    if(uploaded > 0) {
        visitedPhotos.upload.push(id);
    }else {
        visitedPhotos.ig.push(id);
    }
    eventInfo.viewedPhotos = JSON.stringify(visitedPhotos);
    eventObject.put("viewedPhotos", JSON.stringify(visitedPhotos));
    eventObject.saveInBackground(new com.parse.SaveCallback({
        done: function (error) {
            console.log("photo visited");
        }
    }));
}

// Takes a list of visited photos (JSON Array) and a photo ID (int)
//
// Returns true if ID is in visited photos, else returns false
function findIfVisited(id){
    var isVisited = false;
    var visited  = visitedPhotos.ig;
    for(var i = 0; i < visited.length; i++){
        if(parseInt(visited[i]) == id){
            console.log("visited = true");
            isVisited = true;
            break;
        }
    }
    return isVisited;
}

function searchTags(tags, url){
    return new Promise(function(resolve, reject){
        //var accessToken = appSettings.getString("instagram_access_token");
        var accessToken = "305911773.eaf0871.ebf52d56320d45e8b275fc53f1948129";
        var responses = [];
        var getURL;
        if(url){
            getURL = url;
        }else{
            getURL = igAPI + "v1/tags/" + tags[1].trim() + "/media/recent?access_token=" + accessToken;
        }
        console.log(tags);
        if (accessToken) {
                console.log(getURL);
                console.log("inside_access_token");
                http.getJSON({
                    url: getURL,
                    method: "GET"
                }).then(function (response) {
                    //console.log(JSON.stringify(response));
                    //applicationSettings.setString("currentUser",response.objectId);
                     resolve(response);
                }, function (e) {
                    reject("SEARCHING DIDN'T WORK");
                });
        } else {
            reject("couldn't get access token");
        }
    });
}

function getListOfHashtags(hashtags){
    console.log(hashtags);
    return hashtags.split("#");
}

module.exports = Gallery;