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

    return MainViewModel;
})(observableModule.Observable);
exports.MainViewModel = MainViewModel;