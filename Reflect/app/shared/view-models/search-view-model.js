var observableModule = require("data/observable");
var appModule = require("application");
var frameModule = require("ui/frame");
var qs = require('querystring');

var geocoder;
var map;
var http = require("http");
var applicationSettings = require("application-settings");

var arrayOfMatchingIDs = [];

function SearchEventsViewModel() {
	SearchEventsViewModel = new observableModule.Observable({
		
	});
	
	SearchEventsViewModel.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };
	
	SearchEventsViewModel.selectView = function (index) {
		this.set("selectedViewIndex", index);
	};
	
	SearchEventsViewModel.searchEvents = function (keywordSearch) {
		var keywordArray = keywordSearch.text.split(" ");
		console.log("the search terms are: " + keywordArray + "and the number of entries in array are" + keywordArray.length);
		var regexArray = [];
		for (var i = 0; i<keywordArray.length*6; i+=6) {
			
			regexArray = matchString(keywordArray, i, regexArray);
			// converts search word to capitalized word 
			
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
}
exports.SearchEventsViewModel = SearchEventsViewModel;
	
function matchString(keywordArray, i, regexArray) {

			
			var uppercaseString = keywordArray[i/6].charAt(0).toUpperCase() + keywordArray[i/6].slice(1);
			// converts search word to lower case word
			var lowercaseString = keywordArray[i/6].toLowerCase();
			
			var uppercase = {};
			uppercase["title"] = {
				$regex : uppercaseString
			};
			regexArray[i] = uppercase; 
			
			var lowercase = {};
			lowercase["title"] = {
				$regex : lowercaseString
			};
			regexArray[i+1] = lowercase;

			var hashtagUpperCase = {};
			hashtagUpperCase["hashtags"] = {
				$regex: uppercaseString
			};
			regexArray[i+2] = hashtagUpperCase;
			
			var hashtagLowerCase = {};
			hashtagLowerCase["hashtags"] = {
				$regex: lowercaseString
			};
			regexArray[i+3] = hashtagLowerCase;
			
			var descriptionUpperCase = {};
			descriptionUpperCase["description"] = {
				$regex: uppercaseString
			}
			regexArray[i+4] = descriptionUpperCase;
			
			var descriptionLowerCase = {};
			descriptionLowerCase["description"] = {
				$regex: lowercaseString
			}
			regexArray[i+5] = descriptionLowerCase;
			
			return regexArray;
};
module.exports = {
	matchString: matchString

};