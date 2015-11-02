var application = require("application");	
var frameModule = require("ui/frame");
var searchResultsModule = require("./../../shared/view-models/search-results-view-model");

var eventModule;

function loaded(args){
    var page = args.object;
    var context = page.navigationContext;
	console.log("Array passed? " + context);
	eventModule = new searchResultsModule.SearchResultsViewModel(context);
    page.bindingContext = eventModule;
}
exports.loaded = loaded;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;