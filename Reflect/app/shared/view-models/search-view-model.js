var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var appModule = require("application");
var frameModule = require("ui/frame");
var qs = require('querystring');

var geocoder;
var map;
var http = require("http");
var applicationSettings = require("application-settings");

var arrayOfMatchingIDs = [];

var SearchEventsViewModel = (function (_super) {
	__extends(SearchEventsViewModel, _super);
	
	var that;
	
	function SearchEventsViewModel() {
		_super.call(this);
		this.set("selectedViewIndex", 0);
		this._events = [];
		that = this;
	}

	SearchEventsViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };

	SearchEventsViewModel.prototype.selectView = function (index) {
		this.set("selectedViewIndex", index);
	};

	SearchEventsViewModel.prototype.searchEvents = function (hashtagSearch, locationSearch, keywordSearch) {

		var query = qs.stringify({
			where: JSON.stringify({
				title: {
					$regex: "^" + keywordSearch.text
				}
			})
		});
		var url = "https://api.parse.com/1/classes/Event?" + query;

		//Retrieve events
		http.getJSON({
			url: url,
			method: "GET",
			headers: {
				"X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
				"X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
			}
		}).then(function (response) {
			frameModule.topmost().navigate ({
				moduleName: "views/search/search-results-page",
				context: response,
				backstackVisible:true
			});
		}, function (e) {
			console.log(e);
		});

/*		var arrayOfMatchingIDs = [];
		var count = 0;
		http.getJSON({
			url:"https://api.parse.com/1/classes/Event",
			method: "GET",
			headers: {
				"X-Parse-Application-Id": "UZ348s5Fstpa9stS9q5jsDRxihPbt3PpDxQJDawp",
				"X-Parse-REST-API-Key": "iBYBrLJvCSMRD8Ngn5cq4hURPSQ2hEBO9OgPgBu6"
			}
		}).then(function (response) {;
			var eventList = new observableArray.ObservableArray();

			for (var i = 0; i < response.results.length; i++) {
				var event = response.results[i];
				console.log(event.title);
				console.log(event.cover_photo.url);
				console.log("Keyword search: " + keywordSearch.text);
				if (hashtagSearch.text != "") {
					console.log("The title is " + event.title);
					// need to change to events.hashtag once that field is in db
					if (hashtagSearch.text == event.title) {

						arrayOfMatchingIDs[count] = event.objectId;
						console.log("matched text");
						console.log(arrayOfMatchingIDs[count]);
						count++;
					}	 
				}
				if (locationSearch.text != "") {
					// need to convert location to latlong and match
					if (locationSearch.text ==  event.location) {
						
						arrayOfMatchingIDs[count] = event.objectId;
						count++;
					}
				}
				if (keywordSearch.text != "") {
					if (keywordSearch.text == event.title) {
			
						arrayOfMatchingIDs[count] = event.objectId;
						console.log(arrayOfMatchingIDs[count]);
						console.log("matched keyword text");
						count++;
					}
				} 		
			}
		}, function (e) {
			console.log(e);
		});*/
	}; 
	
	return SearchEventsViewModel;

	//SearchEventsViewModel.prototype.locationToLagLong = function ();
	
})(observableModule.Observable);
exports.SearchEventsViewModel = SearchEventsViewModel;