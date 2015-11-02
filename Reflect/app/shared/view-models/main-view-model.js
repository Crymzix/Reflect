var observableModule = require("data/observable");
var application = require("application");
var applicationSettings = require("application-settings");
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
        this.set("loggedIn",true);
    }

    MainViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);
    };

    MainViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };

    return MainViewModel;
})(observableModule.Observable);
exports.MainViewModel = MainViewModel;