var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var appModule = require("application");
var geocoder;
var map;
var http = require("http");

var SearchEventsViewModel = (function (_super) {
    __extends(SearchEventsViewModel, _super);
    function SearchEventsViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

	SearchEventsViewModel.prototype.selectView = function (index) {
        this.set("selectedViewIndex", index);
    };
	
	
	SearchEventsViewModel.prototype.searchEvents = function (hashtagSearch, locationSearch, keywordSearch) {
		var arrayOfMatchingIDs = [];
		var count = 0;
		
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
				if (hashtagSearch.text != "") {
					// need to change to events.hashtag once that field is in db
					if (hashtagSearch.text == event.title) {
						arrayOfMatchingIDs[count] = event.objectId;
						console.log(arrayOfMatchingIDs[count]);
						count++;
					}	 
				}
				else if (locationSearch.text != "") {
					// need to convert location to latlong and match
					if (locationSearch.text ==  event.location) {
						arrayOfMatchingIDs[count] = event.objectId;
						count++;
					}
				}
				else if (keywordSearch.text != "") {
					if (keywordSearch.text == event.title) {
						arrayOfMatchingIDs[count] = event.objectId;
						console.log(arrayOfMatchingIDs[count]);
						count++;
					}
				} 		
            }
        }, function (e) {
            console.log(e);
        });
	};return SearchEventsViewModel;

	//SearchEventsViewModel.prototype.locationToLagLong = function ();
	
})(observableModule.Observable);
exports.SearchEventsViewModel = SearchEventsViewModel;