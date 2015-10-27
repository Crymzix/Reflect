var mainViewModelModule = require("./../../shared/view-models/main-view-model");
var createEventViewModule = require("./../../shared/view-models/create-event-view-model");

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
            //code block
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
    
}
exports.addEvent = addEvent;
