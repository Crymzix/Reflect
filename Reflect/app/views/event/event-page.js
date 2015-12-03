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

    cameraModule.takePicture({width: 612, height: 612, keepAspectRatio: true}).then(function(picture) {
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

function showLocation() {
    eventModel.showLocation();
}
exports.showLocation = showLocation;

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

function save() {
    var imageView = page.getViewById("eventCover");
    var title = page.getViewById("eventTitle");
    var location = page.getViewById("eventLocation");
    var description = page.getViewById("eventDescription");
    var startDate = page.getViewById("eventStartDateLabel");
    var startTime = page.getViewById("eventStartTimeLabel");
    var endDate = page.getViewById("eventEndDateLabel");
    var endTime = page.getViewById("eventEndTimeLabel");
    var hashtags = page.getViewById("eventHashtags");
    eventModel.save(imageView, title, location, description, startDate, startTime, endDate, endTime, hashtags);
}
exports.save = save;

function publish() {
    eventModel.publish();
}
exports.publish = publish;

function viewGallery() {
    eventModel.viewGallery();
}
exports.viewGallery = viewGallery;

function editGallery() {
    eventModel.editGallery();
}
exports.editGallery = editGallery;

function shareGallery() {
    eventModel.shareGallery();
}
exports.shareGallery = shareGallery;