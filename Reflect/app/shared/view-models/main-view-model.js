var observableModule = require("data/observable");
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    MainViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);
    };

    MainViewModel.prototype.checkLoggedIn = function(){
        var currentUser = com.parse.ParseUser.getCurrentUser();
        if(currentUser != null){
            this.set("loggedIn",true);
        } else {
            this.set("loggedIn",false);
        }
    };

    return MainViewModel;
})(observableModule.Observable);
exports.MainViewModel = MainViewModel;