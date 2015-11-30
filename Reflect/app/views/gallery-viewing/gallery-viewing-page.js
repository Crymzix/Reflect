/**
 * Created by Vineet on 2015-11-27.
 */

var view = require("ui/core/view");
var GalleryViewingViewModel = require("../../shared/view-models/gallery-viewing-view-model");
var gallery_viewing;
var image, del;

var dialogs = require("ui/dialogs");
var progressModule = require("ui/progress");

var eventInfo;

var picturePosition;

var pictureCount;



function loaded(args){
    picturePosition = 0;
    var page = args.object;
    eventInfo = page.navigationContext;
    gallery_viewing = new GalleryViewingViewModel.galleryViewing(eventInfo);
    image = page.getViewById("image");
    del = page.getViewById("delete");
    page.bindingContext = gallery_viewing;
}

exports.loaded = loaded;

function swipePicture(eventData){
    console.log("Picture Swiped" +  eventData.direction);
    console.log(gallery_viewing.getPictureCount());
    console.log(picturePosition);
    if(eventData.direction === 8  || eventData.direction === 2){
        if(picturePosition < gallery_viewing.getPictureCount() - 1) {
            picturePosition ++;
            image.animate({
                translate: {x: -600, y: 0},
                duration: 200
            }).then(function () {
                return image.animate({opacity: 0});
            }).then(function () {
                gallery_viewing.swipeLeft();
                return image.animate({
                    translate: {x: 0, y: 0},
                    duration: 1
                });
            }).then(function () {
                return image.animate({opacity: 1, duration: 1000});
            });
        }
    }

    if(eventData.direction === 4  || eventData.direction === 1){
        if(picturePosition > 0) {
            picturePosition--;
            image.animate({
                translate: {x: 600, y: 0},
                duration: 200
            }).then(function () {
                return image.animate({opacity: 0});
            }).then(function () {
                gallery_viewing.swipeRight();
                return image.animate({
                    translate: {x: 0, y: 0},
                    duration: 1
                });
            }).then(function () {
                return image.animate({opacity: 1, duration: 1000});
            });
        }

    }
}

exports.swipePicture = swipePicture;

function deletePhoto(eventData){
    var options = {
        title: "Delete Photo",
        message: "Are you sure you want to remove this photo from your gallery?",
        okButtonText: "Yes",
        cancelButtonText: "No"
    };
    if(picturePosition < gallery_viewing.getPictureCount() - 1){
        dialogs.confirm(options).then(function (result) {
            if(result == true){
                image.animate({
                    translate: { x: -600, y: 0 },
                    duration: 200
                }).then(function(){
                    return image.animate({ opacity: 0 });
                }).then(function(){
                    gallery_viewing.deletePicture();
                    return image.animate({
                        translate: {x: 0, y: 0},
                        duration: 1
                    });
                }).then(function () {
                    return image.animate({ opacity: 1, duration: 1500 });
                });
            }
        });

    }else if(gallery_viewing.getPictureCount() != 0){
        picturePosition--;
        dialogs.confirm(options).then(function (result) {
            if(result == true) {
                image.animate({
                    translate: {x: 600, y: 0},
                    duration: 200
                }).then(function () {
                    return image.animate({opacity: 0});
                }).then(function () {
                    gallery_viewing.deletePicture();
                    return image.animate({
                        translate: {x: 0, y: 0},
                        duration: 1
                    });
                }).then(function () {
                    return image.animate({opacity: 1, duration: 1500});
                });
            }
        });
    }


    del.animate({
        scale: {x: 1.15, y: 1.15},
        duration: 200
    }).then(function(){ return del.animate({ scale :  {x: 1, y: 1}, duration: 200}); });


}

exports.deletePhoto = deletePhoto;


