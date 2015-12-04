/**
 * Created by Vineet on 2015-10-25.
 */
var config = require("../config");
var observableModule = require("data/observable");
var igAPI = config.instagramAPIURL;
var http = require("http");
var qs = require('querystring');
var appModule = require("application");
var appSettings = require("application-settings");



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

    loadPhotos(hashtags, eventInfo.objectId, paginationUrl, visitedPhotos);

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
        visitedPhotos = visitPhoto(picture.id, picture.isUploaded, visitedPhotos);
        visitedPhotoInParse(visitedPhotos, eventInfo, eventObject);
        picture = pictures.pop();
        if(picture){
            setImage(picture);
        }else if(paginationUrl) {
            viewModel.set("isLoading", true);
            setCurrIgInParse(paginationUrl, true);
        }else{
            setCurrIgInParse("", false);
            setImage(null);
            android.widget.Toast.makeText(appModule.android.context, "No new photos!", 0).show();
        }
    };

    viewModel.swipeRight = function(){
        var savedPicture = picture;
        picture = pictures.pop();
        if(picture){
            setImage(picture);
        }else{
            viewModel.set("isLoading", true);
        }
        //Add to event-gallery table
        addToImgur(savedPicture).then(function(resp){
            if(checkImgurStatusCode(resp)){
                addToEventGallery(resp.data, savedPicture).then(function(response){
                    console.log(response);
                    visitedPhotos = visitPhoto(savedPicture.id, savedPicture.isUploaded, visitedPhotos);
                    visitedPhotoInParse(visitedPhotos, eventInfo, eventObject);
                },function (e){
                    console.log(e);
                    android.widget.Toast.makeText(appModule.android.context, "NETWORK ERROR: Couldn't add to Imgur!", 0).show();
                });
            }else{
                android.widget.Toast.makeText(appModule.android.context, "ERROR: Couldn't add to Imgur!", 0).show();
            }

            console.log("swipe_right");
           if(paginationUrl && !picture) {
               setCurrIgInParse(paginationUrl, true);
            }else if(!paginationUrl){
               setImage(null);
               setCurrIgInParse("", false);
               android.widget.Toast.makeText(appModule.android.context, "No new photos!", 0).show();
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
            setImage(picture);

        }else if(paginationUrl) {
            viewModel.set("isLoading", true);
            setCurrIgInParse(paginationUrl, true);
        }else{
            setImage(null);
            setCurrIgInParse("", false);
            android.widget.Toast.makeText(appModule.android.context, "No new photos!", 0).show();
        }
    };

    viewModel.getPictureCount = function(){
      return pictures.length;
    };

    return viewModel;

}



function loadPhotos(tag, eventId, url, visited){
    loadIGPhotos(tag, url, visited).then(function (response) {
        console.log("In IG Photos promise");
        pictures = response;
        loadParsePhotos(eventId).then(function(response){
            viewModel.set("isLoading", false);
            pictures = response;
            picture = pictures.pop();

            if(picture){
                console.log(picture.url);
                setImage(picture);
            }else{
                setImage(null);
                android.widget.Toast.makeText(appModule.android.context, "No new photos!", 0).show();
            }
        }, function(e){
            android.widget.Toast.makeText(appModule.android.context, "NETWORK ERROR: Couldn't load from Parse!", 0).show();
        });

    }, function (err) {
        console.log(err);
        android.widget.Toast.makeText(appModule.android.context, "NETWORK ERROR: Couldn't load from Instagram! Ensure you have logged in with your Instagram Account.", 0).show();
    });
}


function loadParsePhotos(eventId){
    return new Promise(function(resolve, reject){
        var query = qs.stringify({
            where: JSON.stringify({
                userUpload1: "1",
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
            console.log(JSON.stringify(response));
            console.log(response);
            var fullPictures = loadParsePicturesArray(pictures, pictures.length, response);
            resolve(fullPictures);

        }, function(e){
            reject("couldn't get photos from parse");
        });
    });

}


function loadParsePicturesArray(pictures, previousArrayLength, response){
    console.log("in loadparse array");
    if(response){
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
            pictures[previousArrayLength + i] = pictureDefinition;
        }
    }
    return pictures;

}



// This function takes the a hashtag (string) associated with Event and fills
// global picture array with photos from Instagram that haven't already been visited
function loadIGPhotos (tags, url, visited){
    return new Promise(function(resolve, reject){
        searchTags(tags, url).then(function(response){
            if(checkIGStatusCode(response)){
                console.log("in_search_tags_promise");
                paginationUrl = response.pagination.next_url;
                var pictures = loadIGPicturesArray(response, visited);
            }
            else{
                pictures = [];
            }
            console.log("out of loop");
            resolve(pictures);
        }, function(err) {
            console.log(err);
            reject("NO PICTURES");
        });
    });
}

function loadIGPicturesArray(response, visited){
    if(response) {
        var count = 0;
        var dataJSON = response.data;
        var pictures = [];
        console.log(dataJSON.length);
        for (var i = 0; i < dataJSON.length; i++) {
            var id = dataJSON[count].id;
            if (findIfVisited(id, 0, visited)) {
                console.log("visited: " + id);
            } else {
                var pictureDefinition = {
                    "url": dataJSON[count].images.standard_resolution.url,
                    "id": id,
                    "isUploaded": 0,
                    "ip": "",
                    "objectId": ""
                };
                pictures[count] = pictureDefinition;
                count++;
            }
        }

        return pictures;
    }else{
        return [];
    }
}


function visitPhoto(id , uploaded, visitedPhotos){
    if(uploaded == "1") {
        visitedPhotos.upload.push(id);
    }else {
        visitedPhotos.ig.push(id);
    }
    return visitedPhotos;
}

function visitedPhotoInParse(visitedPhotos, eventInfo, eventObject){
    eventInfo.viewedPhotos = JSON.stringify(visitedPhotos);
    eventObject.put("viewedPhotos", JSON.stringify(visitedPhotos));
    eventObject.saveInBackground(new com.parse.SaveCallback({
        done: function (error) {
            console.log("photo visited");
        }
    }));
}

function setCurrIgInParse(paginationUrl, shouldLoad){
    eventInfo.curIGUrl = paginationUrl;
    eventObject.put("curIGUrl", paginationUrl);
    eventObject.saveInBackground(new com.parse.SaveCallback({
        done: function (error) {
            if(shouldLoad){
                console.log("new pagination link added for instagram");
                loadPhotos(hashtags, "eventId", paginationUrl);
            }else {
                console.log("no pagination link to load photos");
            }
        }
    }));
}

function setImage(newPicture){
    if(newPicture) {
        picture = newPicture;
        viewModel.image_id = newPicture.id;
        viewModel.image_url = newPicture.url;
    }else{
        viewModel.image_id = "";
        viewModel.image_url = "";
    }
}


// Takes a list of visited photos (JSON Array) and a photo ID (int)
//
// Returns true if ID is in visited photos, else returns false
function findIfVisited(id, isUploaded, visitedPhotos){
    if(visitedPhotos){
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
    }else{
        return false;
    }
}




function searchTags(tags, url){
    return new Promise(function(resolve, reject){
        var accessToken = appSettings.getString("instagram_access_token");
        //var accessToken = "305911773.eaf0871.ebf52d56320d45e8b275fc53f1948129";
        console.log(accessToken);
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
                photoObject.put("userUpload1", "0");
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
                resolve(resp);
            //}else{
            //    reject("adding image didn't work!")
            //}
        }, function(e){
            reject("post request for adding image didn't work!");
        });
    });
}

function checkImgurStatusCode(response){
    if(response){
        if(response.status == 200){
            return response;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function checkParseStatusCode(response){
    if(response){
        if(response.statusCode == 200){
            return response;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function checkIGStatusCode(response){
    if(response){
        if(response.meta.code == 200){
            return response;
        }else{
            return false;
        }
    }else{
        return false;
    }
}



function getListOfHashtags(hashtags){
    console.log(hashtags);
    return hashtags.split("#");
}

module.exports = {
    Gallery : Gallery,
    visitPhoto : visitPhoto,
    findIfVisited : findIfVisited,
    checkIGStatusCode : checkIGStatusCode,
    checkImgurStatusCode: checkImgurStatusCode,
    checkParseStatusCode : checkParseStatusCode,
    loadIGPicturesArray : loadIGPicturesArray
};