var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var frameModule = require("ui/frame");
var http = require("http");
var applicationSettings = require("application-settings");

var eventList;

var NearbyEventsViewModel = (function (_super) {
    __extends(NearbyEventsViewModel , _super);

    var that;

    function NearbyEventsViewModel () {
        _super.call(this);
        this.set("selectedViewIndex", 0);
        this._events = [];
        that = this;
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
            that._events = response.results;

            for (var i = 0; i < that._events.length; i++) {
                var event = that.events[i];
                console.log(event.title);
                console.log(event.cover_photo.url);
                eventList.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url});
            }

            that.set("nearbyEvents", eventList);
        }, function (e) {
            console.log(e);
        });
    };

    Object.defineProperty(NearbyEventsViewModel.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });

    NearbyEventsViewModel.prototype.listViewItemTap = function(args) {

        var event = this._events[args.index];
        console.log(event.title);
        frameModule.topmost().navigate({
            moduleName: "views/event/event-page",
            context: event,
            backstackVisible: true
        });
    };

    NearbyEventsViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };
    return NearbyEventsViewModel ;
})(observableModule.Observable);
exports.NearbyEventsViewModel  = NearbyEventsViewModel ;