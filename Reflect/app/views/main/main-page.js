var mainViewModelModule = require("./../../shared/view-models/main-view-model");
var createEventViewModule = require("./../../shared/view-models/create-event-view-model");
var nearbyEventsViewModule = require("./../../shared/view-models/nearby-events-view-model");

var appModule = require("application");
var applicationSettings = require("application-settings");
var frameModule = require("ui/frame");

var viewModel;
var page;

function pageLoaded(args) {
    console.log("Page loaded");
    page = args.object;
    viewModel = new mainViewModelModule.MainViewModel();
    page.bindingContext = viewModel;

    frameModule.topmost().android.cachePagesOnNavigate = true;

    var selectedViewIndex = applicationSettings.getNumber("selectedViewIndex", 0);
    createViewModel(selectedViewIndex);
    viewModel.selectView(selectedViewIndex);
}
exports.pageLoaded = pageLoaded;

function showSlideout() {
    var drawer = frameModule.topmost().getViewById("sideDrawer");
    drawer.showDrawer();
}
exports.showSlideout = showSlideout;

function selectView(args) {
    var drawer = frameModule.topmost().getViewById("sideDrawer");
    drawer.closeDrawer();

    // switch view modules for modularity
    var index = parseInt(args.object.tag);
    createViewModel(index);

    viewModel.selectView(index);
    applicationSettings.setNumber("selectedViewIndex", index);
}
exports.selectView = selectView;

function createViewModel(index) {
    switch(index) {
        case 0:
            viewModel = new nearbyEventsViewModule.NearbyEventsViewModel();
            page.bindingContext = viewModel;
            break;
        case 1:
            //code block
            break;
        case 2:
            viewModel = new createEventViewModule.CreateEventViewModel();
            page.bindingContext = viewModel;
            break;
        default:
            //code block
            break;
    }
}
exports.createViewModel = createViewModel;

function choosePhoto() {
    var imageView = page.getViewById("eventCover");
    viewModel.choosePhoto(imageView);
}
exports.choosePhoto = choosePhoto;

function addEvent() {
    var imageView = page.getViewById("eventCover");
    var title = page.getViewById("eventTitle");
    var location = page.getViewById("eventLocation");
    var description = page.getViewById("eventDescription");
    var date = page.getViewById("eventDateLabel");
    var time = page.getViewById("eventTimeLabel");
    viewModel.addEvent(imageView, title, location, description, date, time);
}
exports.addEvent = addEvent;

function showDateModal() {
    var context = "date";
    var fullscreen = false;
    page.showModal("./views/event/date-picker", context, function closeCallback(date) {
        var dateLabel = page.getViewById("eventDateLabel");
        dateLabel.text = date;
    }, fullscreen);
}
exports.setDate = showDateModal;

function showTimeModal() {
    var context = "time";
    var fullscreen = false;
    page.showModal("./views/event/time-picker", context, function closeCallback(time) {
        var timeLabel = page.getViewById("eventTimeLabel");
        timeLabel.text = time;
    }, fullscreen);
}
exports.setTime = showTimeModal;

function listViewItemTap(args) {
    //viewModel.listViewItemTap(args);
    console.log("Tapped index: " + args.index);
}
exports.listViewItemTap = listViewItemTap;