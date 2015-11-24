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

	SearchEventsViewModel.prototype.searchEvents = function (keywordSearch) {
		var keywordArray = keywordSearch.text.split(" ");
		console.log("the search terms are: " + keywordArray);
		var regexArray = [];
		var j = 0;
		for (var i = 0; i<keywordArray.length; i++) {
			
			var uppercase = {};
			var uppercaseString = keywordArray[i].charAt(0).toUpperCase() + keywordArray[i].slice(1);
			uppercase["title"] = {
				$regex : uppercaseString
			};
			regexArray[j] = uppercase; 
			j++;
			
			var lowercase = {};
			var lowercaseString = keywordArray[i].toLowerCase();
			lowercase["title"] = {
				$regex : lowercaseString
			};
			regexArray[j] = lowercase;
			j++
		}
		console.log("the content of regexArray: " + JSON.stringify(regexArray));
		
		var query = qs.stringify({
			where: JSON.stringify({
				$or: regexArray
				/* title: {
						//$regex: "^" regexArray[0];
						$or: regexArray
				} */
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
	}; 
	
	return SearchEventsViewModel;

	//SearchEventsViewModel.prototype.locationToLagLong = function ();
	
})(observableModule.Observable);
exports.SearchEventsViewModel = SearchEventsViewModel;