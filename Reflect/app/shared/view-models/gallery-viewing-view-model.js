/**
 * Created by Vineet on 2015-11-27.
 */
var config = require("../config");
var http = require("http");
var qs = require('querystring');
var observableModule = require("data/observable");
var appModule = require("application");

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

    setLoadingSpinner(true);

    loadPhotos(imgurAlbumId);


    viewModel.swipeRight = function () {
        if (picturePosition > 0) {
            picturePosition--;

            setImage(pictures[picturePosition]);

            getParsePicture(picture.url, eventInfo.eventId);
        }

    };

    viewModel.swipeLeft = function () {
        if (picturePosition < pictures.length - 1) {
            picturePosition++;
            console.log(picture.id);

            setImage(pictures[picturePosition]);

            getParsePicture(picture.url, eventInfo.eventId);
        }
    };

    viewModel.deletePicture = function(){
        var deletingPhoto = pictures[picturePosition];
        var shiftInfo = shiftPhotos(pictures, picturePosition, pictureCount);
        pictures = shiftInfo.pictures;
        picturePosition = shiftInfo.picturePosition;
        pictureCount = shiftInfo.pictureCount;
        setImage(pictures[picturePosition]);
        deletePhoto();

    };

    viewModel.getPictureCount = function(){
        return pictureCount;
    };

    return viewModel;

}

function getParsePicture(imgUrl, eventId){
    var query = qs.stringify({
        where: JSON.stringify({
            photoUrl: imgUrl,
            eventId: eventId
        })
    });
    var url = "https://api.parse.com/1/classes/Event_Gallery?" + query;
    getParsePictureRequest(url).then(function(response){
        if(response.results[0]){
            pictureObject = response.results[0];
        }else{
           android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error encountered; please check connection and try again");
        }

    }, function (e){
        pictureObject = null;
       android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error encountered; please check connection and try again");
    });
    return pictureObject;
}

function getParsePictureRequest(url){
    return new Promise(function(resolve,reject){
        http.getJSON({
            url: url,
            method: "GET",
            headers: {
                "X-Parse-Application-Id": config.parseId,
                "X-Parse-REST-API-Key": config.parseKey
            }
        }).then(function (response) {
            //console.log(JSON.stringify(response));
            resolve(response);
        }, function(e){
            reject("couldnt get photo object from Parse");
            pictureObject = null;
        });
    });
}

function loadPhotos(albumId){
    loadFromImgur(albumId , function(err, resp) {
        var response = checkImgurStatusCode(resp);
        if(response) {
            if(checkImageCount(response) > 0){
                console.log('loading photos');

                pictures = loadPicturesArray(response.data.images);
                pictureCount = pictures.length;
                var firstPicture = pictures[picturePosition];
                if (firstPicture) {
                    console.log('first pic there');
                    setLoadingSpinner(false);
                    setImage(firstPicture);
                }
                pictureObject = getParsePicture(picture.url, eventInfo.eventId);
            }
            else {
                console.log("no photos to show");
                android.widget.Toast.makeText(appModule.android.context, "No photos to show!", 0).show();
            }
        }else if(err){
           android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error encountered; please check connection and try again", 0).show();
        }

    });
}



function loadFromImgur(albumId, callback){
    //console.log(albumId);
   // return new Promise(function(resolve, reject){
    http.getJSON({
        url: config.imgurAPI + "album/" + albumId,
        method: "GET",
        headers: {
            "Authorization": "Client-ID " + config.imgurClientID,
            "Content-Type": "application/json"
        }
    //}, function(response) {
    //    var data = '';
    //    response.on('data', function(chunk) {
    //        data += chunk;
    //    });
    //
    //    response.on('end', function() {
    //        callback(null, JSON.parse(data).data);
    //    });
    //});
    //req.on('error', function(err) {
    //    callback(err);
    //});
    //req.end();
        }).then(function (response) {
            //if(response.data.images_count > 0) {
                console.log(JSON.stringify(response));

                callback(null, response);
                //resolve(response.data);
            //}
            //}else{
            //    var empty= null;
            //    resolve(empty);
            //}
        }, function (e) {
            callback(e);
        });
    //});
}

function loadPicturesArray(images){
    if(images){
        var imageArray = images;
        var picturesArray = [];
        var pictureCount = 0;
        for (pictureCount; pictureCount < imageArray.length; pictureCount++) {
            var id = imageArray[pictureCount].id;
            var pictureDefinition = {
                "url": imageArray[pictureCount].link,
                "id": id,
                "deleteHash": imageArray[pictureCount].deletehash
            };
            picturesArray[pictureCount] = pictureDefinition;
        }
        return picturesArray;
    }else{
        return null;
    }

}

function checkImageCount(response){
    if(response) {
        if (response.data.images_count > 0) {
            return response.data.images_count;
        } else {
            return 0;
        }
    }else{
        return false;
    }
}

function setImage(newPicture){
    if(newPicture){
        picture = newPicture;
        viewModel.image_id = newPicture.id;
        viewModel.image_url = newPicture.url;
    }else{
        viewModel.image_id = "";
        viewModel.image_url = "";
        android.widget.Toast.makeText(appModule.android.context, "No photos to show!", 0).show();
    }

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
            console.log(JSON.stringify(response));
            resolve(response.toJSON());
        }, function(e){
            console.log(e);
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
                    "X-Parse-Application-Id": config.parseId,
                    "X-Parse-REST-API-Key": config.parseKey
                }
            }).then(function(response){
                var resp = response.toJSON();
                resolve(resp);
            }, function(e){
                reject("COULDNT DELETE FROM PARSE:  " + e );
            });
        }
    });

}

function deletePhoto(){
    console.log("in delete Photo method");
    console.log(pictureObject.deleteHash);
    deleteFromImgur().then(function(response){
        if(checkImgurStatusCode(response)){
            console.log("in deleteFrom Imgur promise");
            deleteFromParse().then(function(response){
                if(checkParseStatusCode(response)) {
                    console.log("in deleteFrom Parse promise");
                    getParsePicture(picture.url);
                }else{
                    android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error; please check connection.", 0).show();
                }
            }, function(e){
                android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error; please check connection.", 0).show();
            });
        }else{
            android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error; could not delete photo from Imgur!", 0).show();
        }
    }, function(e){
        android.widget.Toast.makeText(appModule.android.context, "ERROR: Network error; could not delete photo from Imgur!", 0).show();
    });
}

function checkImgurStatusCode(response){
    if(response){
        console.log("here");
        if(response.status == 200){
            console.log("here2");
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


function setLoadingSpinner(status){
    viewModel.set("isLoading", status);
}


function shiftPhotos(pictures, picturePosition, pictureCount){
    if(picturePosition >= pictureCount){
        return null;
    }
    if(picturePosition == pictureCount -1){
        picturePosition--;
    }else{
        for(var i = picturePosition; i < pictureCount - 1; i++ ){
            pictures[i] = pictures[i+1];
        }
    }

    pictures.pop();

    pictureCount--;

    return {
        "pictures" : pictures,
        "picturePosition" : picturePosition,
        "pictureCount" : pictureCount
    };
}

module.exports = {
    galleryViewing: GalleryViewing,
    checkImgurStatusCode : checkImgurStatusCode,
    checkParseStatusCode : checkParseStatusCode,
    checkImageCount : checkImageCount,
    loadPicturesArray : loadPicturesArray,
    shiftPhotos : shiftPhotos

};