var observableModule = require("data/observable");
var EventViewModel = (function (_super) {
    __extends(EventViewModel, _super);
    function EventViewModel(context) {
        _super.call(this);
    }

    return EventViewModel;
})(observableModule.Observable);
exports.EventViewModel = EventViewModel;