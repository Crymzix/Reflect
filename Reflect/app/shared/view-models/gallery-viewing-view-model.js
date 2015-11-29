/**
 * Created by Vineet on 2015-11-27.
 */
var config = require("../config");
var http = require("http");
var qs = require('querystring');
var observableModule = require("data/observable");

var eventInfo;

var picture;
var pictures = [];

var imgurAlbumId;

var viewModel;

var pictureCount;
var picturePosition;
var pictureObject;

function GalleryViewing(info) {

    picturePosition = 0;

    eventInfo = info || "";

    imgurAlbumId = JSON.parse(info.imgurDeleteHash).id;


    viewModel = new observableModule.Observable({
        image_url: "",
        image_id: ""
    });
    viewModel.set("isLoading", true);
    loadPhotos(imgurAlbumId);


    viewModel.swipeRight = function () {
        if (picturePosition > 0) {
            picturePosition--;
            picture = pictures[picturePosition];

            viewModel.set("image_url", picture.url);
            viewModel.set("image_id", picture.id);

            getParsePicture(picture.url);
        }

    };

    viewModel.swipeLeft = function () {
        if (picturePosition < pictures.length - 1) {
            picturePosition++;
            picture = pictures[picturePosition];
            console.log(picture.id);

            viewModel.set("image_url", picture.url);
            viewModel.set("image_id", picture.id);

            getParsePicture(picture.url);
        }
    };

    viewModel.deletePicture = function(){
        var deletingPhoto = pictures[picturePosition];
        shiftPhotos();
        picture = pictures[picturePosition];

        viewModel.set("image_url", picture.url);
        viewModel.set("image_id", picture.id);
        deletePhoto();

    };

    viewModel.getPictureCount = function(){
        return pictureCount;
    };

    return viewModel;

}

function getParsePicture(imgUrl){
    var query = qs.stringify({
        where: JSON.stringify({
            photoUrl: imgUrl,
            eventId: eventInfo.objectId
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
        pictureObject = response.results[0];
        console.log(pictureObject.imgurDeleteHash);
    }, function(e){
        console.log("couldnt get photo object from Parse");
        pictureObject = null;
    });
}

function loadPhotos(albumId){
    loadFromImgur(albumId).then(function(response){
        var dataJSON = response.data;
        var imageArray = dataJSON.images;
        var picturesArray = [];
        for (pictureCount = 0; pictureCount < imageArray.length; pictureCount++) {
            var id = imageArray[pictureCount].id;
            var pictureDefinition = {
                "url": imageArray[pictureCount].link,
                "id": id,
                "deleteHash" : imageArray[pictureCount].deletehash
            };
            console.log(pictureDefinition.url);
            picturesArray[pictureCount] = pictureDefinition;
        }

        pictures = picturesArray;
        picture = pictures[picturePosition];
        console.log(pictureCount);

        if(picture){
            viewModel.set("isLoading", false);
            viewModel.image_id = picture.id;
            viewModel.image_url = picture.url;
        }else{
            console.log("no photos to show");
            // show no photos image
        }

        pictureObject = getParsePicture(picture.url);
    }, function(e){
        console.log(e);
    });

}

function loadFromImgur(albumId){
    return new Promise(function(resolve, reject){
        http.getJSON({
            url: config.imgurAPI + "album/" + albumId ,
            method: "GET",
            headers: {
                "Authorization" : "Client-ID " + config.imgurClientID,
                "Content-Type" : "application/json"
            }
        }).then(function (response) {
            //console.log(JSON.stringify(response));
            //applicationSettings.setString("currentUser",response.objectId);
            resolve(response);
        }, function (e) {
            reject("LOADING FROM IMGUR DIDN'T WORK");
        });
    });
}

function deletePhoto(){
    console.log("in delete Photo method");
    deleteFromImgur().then(function(response){
        console.log("in deleteFrom Imgur promise");
        deleteFromParse().then(function(response){
            console.log("in deleteFrom Parse promise");
            getParsePicture(picture.url);
        }, function(e){
            console.log(e);
        });
    }, function(e){
        console.log(e);
    });
}

function deleteFromImgur(){
    return new Promise(function(resolve, reject){
        http.request({
            url: config.imgurAPI + "image/" + pictureObject.imgurDeleteHash,
            method: "DELETE",
            headers: {
                "Authorization" : "Client-ID " + config.imgurClientID,
                "Content-Type" : "application/json"
            }
        }).then(function(response){
            var resp = response.content.toJSON();
            console.log(JSON.stringify(response));
            //if(resp.statusCode == 200){
            resolve("deleting image worked!");
            //}else{
            //    reject("adding image didn't work!")
            //}
        }, function(e){
            reject("COUDLNT DELETE FROM IMGUR:  " + e);
        });
    });
}

function deleteFromParse(){
    return new Promise(function(resolve, reject){
        if(pictureObject){
            http.request({
                method: "DELETE",
                url: "https://api.parse.com/1/classes/Event_Gallery/"+ pictureObject.objectId,
                headers: {
                    "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                    "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
                }
            }).then(function(response){
                var resp = response.content.toJSON();
                //if(resp.statusCode == 200){
                resolve("successfully deleted from parse!");
                //}else{
                //    reject("adding image didn't work!")
                //}
            }, function(e){
                reject("COULDNT DELETE FROM PARSE:  " + e );
            });
        }
    });

}

function shiftPhotos(){
    for(var i = picturePosition; i < pictureCount - 1; i++ ){
        pictures[i] = pictures[i+1];
    }
    if(picturePosition == pictureCount -1){
        picturePosition--;
    }
    pictures.pop();
    pictureCount--;
}

module.exports = {
    galleryViewing: GalleryViewing,
    loadFromImgur : loadFromImgur
};