var observableModule = require("data/observable");
var imageSource = require("image-source");
var frameModule = require("ui/frame");
var appModule = require("application");
var observableArray = require("data/observable-array");
var http = require("http");
var applicationSettings = require("application-settings");


var events;
 
var SearchResultsViewModel = (function (_super) {
    __extends(SearchResultsViewModel, _super);
	
	var that;
	
    function SearchResultsViewModel(context) {
        _super.call(this);
        this.set("selectedViewIndex", 4);
        this._events = [];
        that = this;

        var eventList = new observableArray.ObservableArray();
        this._events = context.results;
		
		if (this._events) {
				for (var i = 0; i < this._events.length; i++) {
				var event = this._events[i];
				console.log(event.title);
				console.log(event.cover_photo.url);
				eventList.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url, eventItemHashtags: event.hashtags});
				}
        this.set("searchEvents", eventList);
		}
        
    }

	SearchResultsViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };
	
    SearchResultsViewModel.prototype.selectView = function (index) {
        this.set("selectedViewIndex", index);
    };

	SearchResultsViewModel.prototype.listViewItemTap = function(args) {
		
		var event = this._events[args.index];
        console.log(event.title);
        frameModule.topmost().navigate({
            moduleName: "views/event/event-page",
            context: event,
            backstackVisible: true
        });
	};
	
	return SearchResultsViewModel;
	
})(observableModule.Observable);
exports.SearchResultsViewModel = SearchResultsViewModel;