/**
 * Created by Vineet on 2015-10-25.
 */
var config = require("../../shared/config");
var fetchModule = require("fetch");
var igRest = require("../../helpers/instagram-rest.js");
var observableModule = require("data/observable");

function Gallery(info){
    var pictures = [];
    pictures[0] = {
        "url" : "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_7.jpg",
        "id" : 1
    };
    pictures[1] ={
        "url" : "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/12142092_897304940350450_842467889_n.jpg",
        "id" : 2
    };
    info = info || "";

    //var pictures = loadIGPhotos(info.tag, info.eventID);

    var picture = pictures.pop();

    var viewModel = new observableModule.Observable({
        image_url: picture.url || "",
        image_id: picture.id || ""	
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
    var dataJSON = igRest.searchTags(tag).data;
    var pictures = [];
    if(dataJSON != null){
        for(var picture in dataJSON){
            if(picture.hasOwnProperty(dataJSON)){
                var count = 0;
                //Get visited column in event-gallery table
                //var visited = eventModel.getVisited(eventID);
                var id = parseInt(picture.id);
                if(findIfVisited(visited, id)){
                    // We break here because the photos are in order of newest to oldest
                    // So a visited photo would be the newest possible visted photo
                    break;
                }
                var pictureDefinition = {
                    "url" : picture.url,
                    "id" : parseInt(id)
                };
                pictures[count] = pictureDefinition;
                count++;
            }
        }
    }
    return pictures;
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

module.exports = Gallery;