/**
 * Created by Vineet on 2015-10-23.
 */

var observableModule = require("data/observable");
var view = require("ui/core/view");
var GalleryViewModel = require("../../shared/view-models/gallery-view-model");
var gallery = new GalleryViewModel();

function loaded(args){
    var page = args.object;
    //eventInfo = page.navigationContext;
    //gallery = new GalleryViewModel();
    page.bindingContext = gallery;
}

exports.loaded = loaded;

function swipePicture(eventData){
    console.log("Picture Swiped" +  eventData.direction);
    if(eventData.direction === 8  || eventData.direction === 2){
        gallery.visitPhoto();
        gallery.swipeLeft();
    }

    if(eventData.direction === 4  || eventData.direction === 1){
        gallery.visitPhoto();
        gallery.swipeRight();
    }
}

exports.swipePicture = swipePicture;

function swipeLeft(eventData){
    gallery.visitPhoto();
    gallery.swipeLeft();
}
exports.swipeLeft = swipeLeft;

function swipeRight(eventData){
    gallery.visitPhoto();
    gallery.swipeRight();
}

exports.swipeRight = swipeRight;



