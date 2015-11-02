var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var frameModule = require("ui/frame");
var http = require("http");
var qs = require('querystring');
var applicationSettings = require("application-settings");

var eventList;

var EventsViewModel = (function (_super) {
    __extends(EventsViewModel , _super);

    var that;

    function EventsViewModel (isUser) {
        _super.call(this);
        this.set("selectedViewIndex", 0);
        this._events = [];
        this._isUser = isUser;
        that = this;
    }

    EventsViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);

        var url;
        var userId = applicationSettings.getString("currentUser");
        if (this._isUser) {
            var query = qs.stringify({
                where: JSON.stringify({
                    userId: userId
                })
            });
            url = "https://api.parse.com/1/classes/Event?" + query;
            console.log(url);
        } else {
            url = "https://api.parse.com/1/classes/Event";
        }

        //Retrieve events
        http.getJSON({
            url: url,
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
                eventList.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url, eventItemHashtags: event.hashtags});
            }

            that.set("nearbyEvents", eventList);
        }, function (e) {
            console.log(e);
        });
    };

    Object.defineProperty(EventsViewModel.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });

    EventsViewModel.prototype.listViewItemTap = function(args) {

        var event = this._events[args.index];

        if (this._isUser) {
            event["isOwner"] = true;
        } else {
            event["isOwner"] = false;
        }

        console.log(event.title);
        frameModule.topmost().navigate({
            moduleName: "views/event/event-page",
            context: event,
            backstackVisible: true
        });
    };

    EventsViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };
    return EventsViewModel ;
})(observableModule.Observable);
exports.EventsViewModel = EventsViewModel ;