var application = require("application");	
var frameModule = require("ui/frame");
var searchResultsModule = require("./../../shared/view-models/search-results-view-model");

var viewModel;

function loaded(args){
    var page = args.object;
    var context = page.navigationContext;
    viewModel = new searchResultsModule.SearchResultsViewModel(context);
    page.bindingContext = viewModel;
}
exports.loaded = loaded;

function listViewItemTap(args) {
    viewModel.listViewItemTap(args);
}
exports.listViewItemTap = listViewItemTap;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;