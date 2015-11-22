var mainViewModelModule = require("./../../shared/view-models/main-view-model");
var createEventViewModule = require("./../../shared/view-models/create-event-view-model");
var searchEventViewModule = require("./../../shared/view-models/search-view-model");
var searchResultsViewModule = require("./../../shared/view-models/search-results-view-model");
var eventsViewModule = require("./../../shared/view-models/events-list-view-model");
var dialogsModule = require("ui/dialogs");


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
    viewModel.checkLoggedIn();
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
            viewModel = new eventsViewModule.EventsViewModel(false);
            page.bindingContext = viewModel;
            viewModel.checkLoggedIn();
            break;
        case 1:
            viewModel = new eventsViewModule.EventsViewModel(true);
            page.bindingContext = viewModel;
            viewModel.checkLoggedIn();
            break;
        case 2:
            viewModel = new createEventViewModule.CreateEventViewModel();
            page.bindingContext = viewModel;
			viewModel.checkLoggedIn();
			break;
		case 3:
			viewModel = new searchEventViewModule.SearchEventsViewModel();
			page.bindingContext = viewModel;
			viewModel.checkLoggedIn();
            break;
		case 4: 
			viewModel = new searchResultsViewModule.SearchResultsViewModel();
			page.bindingContext = viewModel;
			viewModel.checkLoggedIn();
			break;
		case 5:
			viewModel.checkLoggedIn();
			break;
        default:
            //code block
            viewModel.checkLoggedIn();
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
    var hashtags = page.getViewById("eventHashtags");
    viewModel.addEvent(imageView, title, location, description, date, time, hashtags);
}

exports.selectView = selectView;

exports.switchToLogin = switchToLogin;

function switchToLogin(args){
    var topmost = frameModule.topmost();
    topmost.navigate("views/login/login-page");
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
    viewModel.listViewItemTap(args);
}
exports.listViewItemTap = listViewItemTap;

function showSearch() {

    frameModule.topmost().navigate ({
        moduleName: "views/search/search-page",
        backstackVisible: true
    });
}
exports.showSearch = showSearch;

function logOut(){
    applicationSettings.remove("currentUser");
    createViewModel(0);

    viewModel.selectView(0);
    applicationSettings.setNumber("selectedViewIndex", 0);
}
exports.logOut = logOut;


