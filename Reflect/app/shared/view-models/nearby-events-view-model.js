var observableModule = require("data/observable");
var http = require("http");

var NearbyEventsViewModel = (function (_super) {
    __extends(NearbyEventsViewModel , _super);
    function NearbyEventsViewModel () {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    NearbyEventsViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);

        //Retrieve events
        http.getJSON({
            url:"https://api.parse.com/1/classes/Event",
            method: "GET",
            headers: {
                "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
            }
        }).then(function (response) {
            console.log(JSON.stringify(response));
        }, function (e) {
            console.log(e);
        });
    };

    return NearbyEventsViewModel ;
})(observableModule.Observable);
exports.NearbyEventsViewModel  = NearbyEventsViewModel ;