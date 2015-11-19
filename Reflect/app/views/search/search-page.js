var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var searchEventsViewModule = require("./../../shared/view-models/search-view-model");
var page;
var viewModule;

function loaded(args){
    page = args.object;
    viewModule = new searchEventsViewModule.SearchEventsViewModel();

    if (android) {
        page.getViewById("hashtagSearch").android.clearFocus();
        page.getViewById("locationSearch").android.clearFocus();
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

    var hashtagSearch = page.getViewById("hashtagSearch");
    var locationSearch = page.getViewById("locationSearch");
    var keywordSearch = page.getViewById("keywordSearch");

    viewModule.searchEvents(hashtagSearch, locationSearch, keywordSearch);
}
exports.searchEvents = searchEvents;