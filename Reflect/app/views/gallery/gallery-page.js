/**
 * Created by Vineet on 2015-10-23.
 */

var observableModule = require("data/observable");
var view = require("ui/core/view");
var borderModule = require("ui/border");
var activityIndicatorModule = require("ui/activity-indicator");
var GalleryViewModel = require("../../shared/view-models/gallery-view-model");
var gallery;
var image, reject, accept;

var dialogsModule = require("ui/dialogs");

var eventInfo;


function loaded(args){
    var page = args.object;
    eventInfo = page.navigationContext;
    gallery = new GalleryViewModel.Gallery(eventInfo);
    image = page.getViewById("image");
    reject = page.getViewById("reject");
    accept = page.getViewById("accept");
    page.bindingContext = gallery;
}

exports.loaded = loaded;

function swipePicture(eventData){
    if(gallery.getPictureCount() > 0) {
        console.log("Picture Swiped" + eventData.direction);
        if (eventData.direction === 8 || eventData.direction === 2) {
            image.animate({
                translate: {x: -600, y: 0},
                duration: 200
            }).then(function () {
                return image.animate({opacity: 0});
            }).then(function () {
                gallery.visitPhoto();
                gallery.swipeLeft();
                return image.animate({
                    translate: {x: 0, y: 0},
                    duration: 1
                });
            }).then(function () {
                return image.animate({opacity: 1, duration: 1500});
            });

            reject.animate({
                scale: {x: 1.10, y: 1.10},
                duration: 200
            }).then(function () {
                return reject.animate({scale: {x: 1, y: 1}, duration: 200});
            });


        }

        if (eventData.direction === 4 || eventData.direction === 1) {
            image.animate({
                translate: {x: 600, y: 0},
                duration: 200
            }).then(function () {
                return image.animate({opacity: 0});
            }).then(function () {
                gallery.visitPhoto();
                gallery.swipeRight();
                return image.animate({
                    translate: {x: 0, y: 0},
                    duration: 1
                });
            }).then(function () {
                return image.animate({opacity: 1, duration: 1500});
            });

            accept.animate({
                scale: {x: 1.10, y: 1.10},
                duration: 100
            }).then(function () {
                return accept.animate({scale: {x: 1, y: 1}, duration: 200});
            });


        }
    }
}

exports.swipePicture = swipePicture;

function swipeLeft(eventData){
    if(gallery.getPictureCount() > 0) {
        image.animate({
            translate: {x: -600, y: 0},
            duration: 200
        }).then(function () {
            return image.animate({opacity: 0});
        }).then(function () {
            gallery.visitPhoto();
            gallery.swipeLeft();
            return image.animate({
                translate: {x: 0, y: 0},
                duration: 1
            });
        }).then(function () {
            return image.animate({opacity: 1, duration: 1500});
        });

        reject.animate({
            scale: {x: 1.10, y: 1.10},
            duration: 100
        }).then(function () {
            return reject.animate({scale: {x: 1, y: 1}, duration: 200});
        });
    }
}
exports.swipeLeft = swipeLeft;

function swipeRight(eventData){
    if(gallery.getPictureCount() > 0) {
        image.animate({
            translate: {x: 600, y: 0},
            duration: 200
        }).then(function () {
            return image.animate({opacity: 0});
        }).then(function () {
            gallery.visitPhoto();
            gallery.swipeRight();
            return image.animate({
                translate: {x: 0, y: 0},
                duration: 1
            });
        }).then(function () {
            return image.animate({opacity: 1, duration: 1500});
        });

        accept.animate({
            scale: {x: 1.10, y: 1.10},
            duration: 100
        }).then(function () {
            return accept.animate({scale: {x: 1, y: 1}, duration: 200});
        });
    }

}

exports.swipeRight = swipeRight;

function reportPicture(){
    if(gallery.getPictureCount() > 0) {
        var options = {
            title: "Report Photo",
            message: "Are you sure you want to report this photo?",
            okButtonText: "Yes",
            cancelButtonText: "No"
        };
        dialogs.confirm(options).then(function (result) {
            if (result == true) {
                image.animate({
                    translate: {x: -300, y: 0},
                    duration: 200
                }).then(function () {
                    return image.animate({opacity: 0});
                }).then(function () {
                    gallery.visitPhoto();
                    gallery.reportPicture();
                    return image.animate({
                        translate: {x: 0, y: 0},
                        duration: 1
                    });
                }).then(function () {
                    return image.animate({opacity: 1, duration: 1500});
                });

                reject.animate({
                    scale: {x: 1.10, y: 1.10},
                    duration: 100
                }).then(function () {
                    return reject.animate({scale: {x: 1, y: 1}, duration: 200});
                });
            }
        });
    }
}

exports.reportPicture = reportPicture;



