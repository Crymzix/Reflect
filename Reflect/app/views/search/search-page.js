var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var searchEventsViewModule = require("./../../shared/view-models/search-view-model");
var page;
var viewModule;

function loaded(args){
    page = args.object;
    viewModule = new searchEventsViewModule.SearchEventsViewModel();

    if (android) {

        page.getViewById("keywordSearch").android.clearFocus();
    }

    page.bindingContext = viewModule;
}
exports.loaded = loaded;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;

function searchEvents() {

 
    var keywordSearch = page.getViewById("keywordSearch");

    viewModule.searchEvents(keywordSearch);
}

/* function locationSearch() {
	viewModule.locationSearch();
} */
exports.searchEvents = searchEvents;