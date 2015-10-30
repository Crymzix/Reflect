var application = require("application");
var frameModule = require("ui/frame");
var eventViewModule = require("./../../shared/view-models/event-view-model");

var eventModule;

function loaded(args){
    var page = args.object;
    var context = page.navigationContext;
    console.log(context);
    eventModule = new eventViewModule.EventViewModel(context);
    page.bindingContext = eventModule;
}
exports.loaded = loaded;

function back() {
    frameModule.topmost().goBack();
}
exports.back = back;