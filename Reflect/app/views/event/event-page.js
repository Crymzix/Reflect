var application = require("application");
var frameModule = require("ui/frame");
var cameraModule = require("camera");
var eventViewModule = require("./../../shared/view-models/event-view-model");

var eventModel;
var page;
var context;

function loaded(args){

    page = args.object;
    context = page.navigationContext;
    eventModel = new eventViewModule.EventViewModel(context);
    page.bindingContext = eventModel;
}
exports.loaded = loaded;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;

function takePicture() {

    cameraModule.takePicture({width: 300, height: 300, keepAspectRatio: true}).then(function(picture) {
        var image = page.getViewById("uploadedImage");
        image.imageSource = picture;

        eventModel.makeUploadVisible();

    });
}
exports.takePicture = takePicture;

function upload() {

    var image = page.getViewById("uploadedImage");
    eventModel.upload(image);

}
exports.upload = upload;

function goToGallery() {
    var topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: "views/gallery/gallery-page",
        context: context,
        backstackVisible: true
    });
}
exports.goToGallery = goToGallery;