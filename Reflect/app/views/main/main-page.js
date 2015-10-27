var viewModelModule = require("./../../shared/view-models/main-view-model");
var frameModule = require("ui/frame");
var viewModel;
function pageLoaded(args) {
    console.log("Page loaded");
    var page = args.object;
    viewModel = new viewModelModule.MainViewModel();
    page.bindingContext = viewModel;
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

    var index = args.object.tag;
    viewModel.selectView(parseInt(index));
}
exports.selectView = selectView;

exports.switchToLogin = switchToLogin;

function switchToLogin(args){
    var topmost = frameModule.topmost();
    topmost.navigate("views/login/login-page");
}