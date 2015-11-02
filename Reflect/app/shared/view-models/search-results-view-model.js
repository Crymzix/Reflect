var observableModule = require("data/observable");
var imageSource = require("image-source");
var imageModule = require("ui/image");
var appModule = require("application");
var observableArray = require("data/observable-array");
var http = require("http");


var events;
 
var SearchResultsViewModel = (function (_super) {
    __extends(SearchResultsViewModel, _super);
	
	var that;
	
    function SearchResultsViewModel(context) {
        _super.call(this);
		console.log("Array passed? " + context);
        this.set("selectedViewIndex", 4);
		that = this;
		http.getJSON({
            url:"https://api.parse.com/1/classes/Event",
            method: "GET",
            headers: {
                "X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
                "X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
            }
        }).then(function (response) {
			
            events = new observableArray.ObservableArray();
		
			for (var i = 0; i < response.results.length; i++) {
				var event = response.results[i];				
				if (context == event.objectId) {
					events.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url});
					console.log("got a match!");
				}
			}
			
			that.set("searchEvents", events);
			
		}, function (e) {
            console.log(e);
        });
    }

    SearchResultsViewModel.prototype.selectView = function (index) {
        this.set("selectedViewIndex", index);
    };

	SearchResultsViewModel.prototype.listViewItemTap = function(args) {
		
		var event = this._events[args.index];
        console.log(event.title);
        frameModule.topmost().navigate({
            moduleName: "views/search/event-page",
            context: event,
            backstackVisible: true
        });
	};
	
	return SearchResultsViewModel;
	
})(observableModule.Observable);
exports.SearchResultsViewModel = SearchResultsViewModel;