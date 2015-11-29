/**
 * Created by Vineet on 2015-10-25.
 */
var config = require("../config");
var fetchModule = require("fetch");
var igRest = require("../../helpers/instagram-rest.js");
var observableModule = require("data/observable");
var igAPI = config.instagramAPIURL;
var http = require("http");
var qs = require('querystring');



var pictures;
var picture;
var eventObject;
var eventInfo;
var visitedPhotos;
var paginationUrl;

var imgurDeleteHash;

var viewModel;

function Gallery(info){
    eventInfo = info || "";
    var hashtags = getListOfHashtags(eventInfo.hashtags);

    imgurDeleteHash = JSON.parse(info.imgurDeleteHash).deleteHash;

    visitedPhotos = JSON.parse(eventInfo.viewedPhotos);

    paginationUrl = eventInfo.curIGUrl;

    loadPhotos(hashtags, eventInfo.objectId, paginationUrl);

    eventObject = com.parse.ParseObject.createWithoutData("Event", eventInfo.objectId);
    try {
        eventObject = eventObject.fetchIfNeeded();

    } catch(e){
        console.log(e);
    }


    viewModel = new observableModule.Observable({
        image_url: "",
        image_id:  ""
    });
    viewModel.set("isLoading", true);
    viewModel.visitPhoto = function(){
        console.log("Visit Photo");

        //visitPhoto(picture.id, picture.isUploaded);

    };

    viewModel.swipeLeft = function(){
        visitPhoto(picture.id, picture.isUploaded);
        console.log("swipe_left");
        picture = pictures.pop();
        if(picture){
            viewModel.set("image_url" , picture.url);
            viewModel.set("image_id", picture.id);
        }else if(paginationUrl) {
            viewModel.set("isLoading", true);
            eventInfo.curIGUrl = paginationUrl;
            eventObject.put("curIGUrl", paginationUrl);
            eventObject.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    console.log("new pagination link added for instagram");
                    loadPhotos(hashtags, "eventId", paginationUrl);
                }
            }));
        }else{
            eventObject.put("curIGUrl", "");
            eventObject.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    console.log("original pagination link added for instagram");
                }
            }));
            //set photo to NO MORE PHOTOS;
        }
    };

    viewModel.swipeRight = function(){
        var savedPicture = picture;
        picture = pictures.pop();
        if(picture){
            viewModel.set("image_url" , picture.url);
            viewModel.set("image_id", picture.id);
        }else{
            viewModel.set("isLoading", true);
        }
        //Add to event-gallery table
        addToImgur(savedPicture).then(function(resp){
            addToEventGallery(resp, savedPicture).then(function(response){
                console.log(response);
                visitPhoto(savedPicture.id, savedPicture.isUploaded);
            },function (e){
                console.log(e);
            });
            console.log("swipe_right");
           if(paginationUrl && !picture) {
                eventInfo.curIGUrl = paginationUrl;
                eventObject.put("curIGUrl", paginationUrl);
                eventObject.saveInBackground(new com.parse.SaveCallback({
                    done: function (error) {
                        console.log("new pagination link added for instagram");
                        loadPhotos(hashtags, "eventId", paginationUrl);
                    }
                }));
            }else if(!paginationUrl){
               eventObject.put("curIGUrl", "");
               eventObject.saveInBackground(new com.parse.SaveCallback({
                   done: function (error) {
                       console.log("original pagination link added for instagram");
                   }
               }));
                //set photo to NO MORE PHOTOS;
            }
        }, function(e){
            console.log(e);
        });

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

        }else{
            //show no more photos
        }
    };

    return viewModel;

}




function loadPhotos(tag, eventId, url){
    loadIGPhotos(tag, "event", url).then(function (response) {
        console.log("In IG Photos promise");
        pictures = response;
        loadParsePhotos(eventId).then(function(response){
            viewModel.set("isLoading", false);
            pictures = response;
            picture = pictures.pop();

            if(picture){
                console.log(picture.url);
                viewModel.set("image_url", picture.url);
                viewModel.set("image_id", picture.id);
            }else{
                //show no more photos image
            }
        }, function(e){
           console.log(e);
        });


    }, function (err) {
        console.log(err);
    });
}




function loadParsePhotos(eventId){
    return new Promise(function(resolve, reject){
        var query = qs.stringify({
            where: JSON.stringify({
                userUpload: 1,
                eventId: eventId
            })
        });
        var url = "https://api.parse.com/1/classes/Event_Gallery?" + query;
        http.getJSON({
            url: url,
            method: "GET",
            headers: {
                "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
            }
        }).then(function (response) {
            var prePictureArrayLength = pictures.length;
            var results = response.results;
            console.log(results.length);
            for(var i = 0; i < results.length ; i++){
                var result = results[i];
                var pictureDefinition = {
                    "url": result.photoUrl,
                    "id": result.objectId,
                    "isUploaded" : 1,
                    "ip" : result.ipAddress,
                    "objectId": result.objectId
                };
                pictures[prePictureArrayLength + i] = pictureDefinition;
            }
            resolve(pictures);
        }, function(e){
            resolve("couldn't get photos from parse");
        });
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
                var id = dataJSON[count].id;
                //console.log(dataJSON[count].images.standard_resolution.url);
                if(findIfVisited(id, 0)){
                    //  do nothing;
                    console.log(id);
                }else {
                    var pictureDefinition = {
                        "url": dataJSON[count].images.standard_resolution.url,
                        "id": id,
                        "isUploaded" : 0,
                        "ip" : "",
                        "objectId" : ""
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
function findIfVisited(id, isUploaded){
    var visited;
    if(isUploaded == 0) {
        visited = visitedPhotos.ig;
    }else {
        visited = visitedPhotos.upload;
    }
        var isVisited = false;
        for (var i = 0; i < visited.length; i++) {
            if (visited[i] == id) {
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




function addToEventGallery(response, picture){
    return new Promise(function(resolve, reject){
        if(picture.isUploaded == 0){
            var img = new com.parse.ParseObject("Event_Gallery");
            img.put("eventId", eventInfo.objectId);
            //img.put("userUpload", isIg);
            img.put("photoUrl", response.link);
            img.put("imgurDeleteHash", response.deletehash);
            img.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    if(error) {
                        reject("error");
                    }else{
                        //Clear input fields
                        console.log("img saved to parse db");
                        resolve("image_added");
                    }
                }}));
        }else{
            var photoObject = com.parse.ParseObject.createWithoutData("Event_Gallery", picture.objectId);
            try {
                photoObject = photoObject.fetchIfNeeded();
                photoObject.put("photoUrl", response.link);
                photoObject.put("imgurDeleteHash", response.deletehash);
                photoObject.put("userUpload", 0);
                photoObject.saveInBackground(new com.parse.SaveCallback({
                    done: function (error) {
                        if(error) {
                            reject("error");
                        }else{
                            //Clear input fields
                            console.log("img updated in parse db");
                            resolve("image_added");
                        }
                    }}));

            } catch(e){
                console.log(e);
            }
        }

    });
}




function addToImgur(picture){
    return new Promise(function(resolve, reject){
        http.request({
            url: config.imgurAPI + "image",
            method: "POST",
            headers: {
                "Authorization" : "Client-ID " + config.imgurClientID,
                "Content-Type" : "application/json"
            },
            content: JSON.stringify({
                image: picture.url,
                album: imgurDeleteHash
            })
        }).then(function(response){
            var resp = response.content.toJSON();
            //console.log(response.content.statusCode);
            console.log(resp.data.deletehash);
            //if(resp.statusCode == 200){
                resolve(resp.data);
            //}else{
            //    reject("adding image didn't work!")
            //}
        }, function(e){
            reject("post request for adding image didn't work!");
        });
    });
}



function getListOfHashtags(hashtags){
    console.log(hashtags);
    return hashtags.split("#");
}

module.exports = Gallery;