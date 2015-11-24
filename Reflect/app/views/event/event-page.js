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

function showStartDateModal() {
    var context = "date";
    var fullscreen = false;
    page.showModal("./views/event/date-picker", context, function closeCallback(date) {
        var dateLabel = page.getViewById("eventStartDateLabel");
        dateLabel.text = date;
    }, fullscreen);
}
exports.setStartDate = showStartDateModal;

function showStartTimeModal() {
    var context = "time";
    var fullscreen = false;
    page.showModal("./views/event/time-picker", context, function closeCallback(time) {
        var timeLabel = page.getViewById("eventStartTimeLabel");
        timeLabel.text = time;
    }, fullscreen);
}
exports.setStartTime = showStartTimeModal;

function showEndDateModal() {
    var context = "date";
    var fullscreen = false;
    page.showModal("./views/event/date-picker", context, function closeCallback(date) {
        var dateLabel = page.getViewById("eventEndDateLabel");
        dateLabel.text = date;
    }, fullscreen);
}
exports.setEndDate = showEndDateModal;

function showEndTimeModal() {
    var context = "time";
    var fullscreen = false;
    page.showModal("./views/event/time-picker", context, function closeCallback(time) {
        var timeLabel = page.getViewById("eventEndTimeLabel");
        timeLabel.text = time;
    }, fullscreen);
}
exports.setEndTime = showEndTimeModal;