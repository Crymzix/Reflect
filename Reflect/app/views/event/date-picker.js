var gesturesModule = require("ui/gestures");
var frameModule = require("ui/frame");
var context;
var closeCallback;

function loaded(args) {
    console.log("Page loaded");
    page = args.object;
}
exports.loaded = loaded;

function onShownModally(args) {
    context = args.context;
    closeCallback = args.closeCallback;
}
exports.onShownModally = onShownModally;

function confirm() {
    var date = page.getViewById("eventDate");
    var dateString = date.month + "/" + date.day + "/" + date.year;
    closeCallback(dateString);
}
exports.confirm = confirm;