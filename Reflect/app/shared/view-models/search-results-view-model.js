var observableModule = require("data/observable");
var imageSource = require("image-source");
var imageModule = require("ui/image");
var appModule = require("application");
var observableArray = require("data/observable-array");
var http = require("http");

var SearchResultsViewModel = (function (_super) {
    __extends(SearchResultsViewModel, _super);
    function SearchResultsViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    SearchResultsViewModel.prototype.selectView = function (index) {
        this.set("selectedViewIndex", index);
    };
	
	SearchResultsViewModel.prototype.matchEventIds = function (arrayOfIds) {
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
				for (var j = 0; j < arrayOfIds.length; j++) {
					if (arrayOfIds[j] == event.objectId) {
						events.push({eventItemTitle: event.title, eventItemImage: event.cover_photo.url});
					}
				}
			}
		}, function (e) {
            console.log(e);
        });			
	}; return SearchResultsViewModel;
	
})(observableModule.Observable);
exports.SearchResultsViewModel = SearchResultsViewModel;