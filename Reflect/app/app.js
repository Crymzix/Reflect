var application = require("application");
var navigationEntry = {
    moduleName : "views/dispatch/dispatch-page",
    backstackVisible: false
}
application.mainEntry = navigationEntry;
application.cssFile = "./app.css";
application.start();
