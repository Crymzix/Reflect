var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var frameModule = require("ui/frame");
var http = require("http");

var eventList;
var events;
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
        }).then(function (response) {

            eventList = new observableArray.ObservableArray();
            events = response.results;

            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                console.log(event.title);
                console.log(event.cover_photo.url);
                eventList.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url, eventId: event.objectId});
            }

            self.set("nearbyEvents", eventList);
        }, function (e) {
            console.log(e);
        });
    };

    NearbyEventsViewModel.prototype.listViewItemTap = function(index) {

        var events = this.get("nearbyEvents");

        frameModule.topmost().navigate({
            moduleName: "views/event/event-page",
            context: events.getItem(index),
            backstackVisible: true
        });
    };

    return NearbyEventsViewModel ;
})(observableModule.Observable);
exports.NearbyEventsViewModel  = NearbyEventsViewModel ;