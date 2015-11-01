var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var SearchViewModel = require("../../shared/view-models/search-view-model");

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = SearchViewModel;
}
exports.loaded = loaded;