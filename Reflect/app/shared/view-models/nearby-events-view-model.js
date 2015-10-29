var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var http = require("http");
var eventsListview;
var self;

var NearbyEventsViewModel = (function (_super) {
    __extends(NearbyEventsViewModel , _super);
    function NearbyEventsViewModel () {
        _super.call(this);
        this.set("selectedViewIndex", 0);
        self = this;
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
        }).then(function (response) {;
            var events = new observableArray.ObservableArray();

            for (var i = 0; i < response.results.length; i++) {
                var event = response.results[i];
                console.log(event.title);
                console.log(event.cover_photo.url);
                events.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url});
            }

            self.set("nearbyEvents", events);
        }, function (e) {
            console.log(e);
        });
    };

    return NearbyEventsViewModel ;
})(observableModule.Observable);
exports.NearbyEventsViewModel  = NearbyEventsViewModel ;