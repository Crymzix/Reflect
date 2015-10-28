var observableModule = require("data/observable");
var NearbyEventsViewModel = (function (_super) {
    __extends(NearbyEventsViewModel , _super);
    function NearbyEventsViewModel () {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    NearbyEventsViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);

    };

    return NearbyEventsViewModel ;
})(observableModule.Observable);
exports.NearbyEventsViewModel  = NearbyEventsViewModel ;