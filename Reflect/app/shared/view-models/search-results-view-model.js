var observableModule = require("data/observable");
var imageSource = require("image-source");
var frameModule = require("ui/frame");
var appModule = require("application");
var observableArray = require("data/observable-array");
var http = require("http");
var applicationSettings = require("application-settings");
var dialogsModule = require("ui/dialogs");

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
                var firstChar = event.title.charAt(0);

                var image = null;
                switch (firstChar.toUpperCase()) {

                    case "A":
                        image = imageSource.fromResource("a");
                        break;
                    case "B":
                        image = imageSource.fromResource("b");
                        break;
                    case "C":
                        image = imageSource.fromResource("c");
                        break;
                    case "D":
                        image = imageSource.fromResource("d");
                        break;
                    case "E":
                        image = imageSource.fromResource("e");
                        break;
                    case "F":
                        image = imageSource.fromResource("f");
                        break;
                    case "G":
                        image = imageSource.fromResource("g");
                        break;
                    case "H":
                        image = imageSource.fromResource("h");
                        break;
                    case "I":
                        image = imageSource.fromResource("i");
                        break;
                    case "J":
                        image = imageSource.fromResource("j");
                        break;
                    case "K":
                        image = imageSource.fromResource("k");
                        break;
                    case "L":
                        image = imageSource.fromResource("l");
                        break;
                    case "M":
                        image = imageSource.fromResource("m");
                        break;
                    case "N":
                        image = imageSource.fromResource("n");
                        break;
                    case "O":
                        image = imageSource.fromResource("o");
                        break;
                    case "P":
                        image = imageSource.fromResource("p");
                        break;
                    case "Q":
                        image = imageSource.fromResource("q");
                        break;
                    case "R":
                        image = imageSource.fromResource("r");
                        break;
                    case "S":
                        image = imageSource.fromResource("s");
                        break;
                    case "T":
                        image = imageSource.fromResource("t");
                        break;
                    case "U":
                        image = imageSource.fromResource("u");
                        break;
                    case "V":
                        image = imageSource.fromResource("v");
                        break;
                    case "W":
                        image = imageSource.fromResource("w");
                        break;
                    case "X":
                        image = imageSource.fromResource("x");
                        break;
                    case "Y":
                        image = imageSource.fromResource("y");
                        break;
                    case "Z":
                        image = imageSource.fromResource("z");
                        break;
                }

                eventList.push({eventItemTitle: event.title, eventItemImage: image, eventItemHashtags: event.hashtags});

			}

            this.set("searchEvents", eventList);
		}
		if (this._events == null || this._events.length ==0) {
			dialogsModule.alert ({
				message: "Unforunately, no search results were found...",
				okButtonText: "OK"
			});
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