var observableModule = require("data/observable");
var imageSource = require("image-source");
var imageModule = require("ui/image");
var appModule = require("application");
var applicationSettings = require("application-settings");
var config = require("../config");
var http = require("http");

var REQUEST_SELECT_IMAGE = 1234;
var REQUEST_LOCATION = 1235;
var currentBitmap;
var currentLocation = null;

var viewModel;

function CreateEventViewModel() {

    viewModel = new observableModule.Observable({

    });

    viewModel.set("title", applicationSettings.getString("eventTitle"));
    viewModel.set("description", applicationSettings.getString("eventDescription"));
    viewModel.set("hashtags", applicationSettings.getString("eventHashtags"));

    viewModel.selectView = function (index) {
        viewModel.set("selectedViewIndex", index);
    }

    viewModel.choosePhoto = function (imageView) {
        new Promise(function (resolve, reject) {
            try {
                var takePictureIntent = new android.content.Intent(android.content.Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                if (takePictureIntent.resolveActivity(appModule.android.context.getPackageManager()) != null) {
                    var previousResult = appModule.android.onActivityResult;
                    appModule.android.onActivityResult = function (requestCode, resultCode, data) {
                        appModule.android.onActivityResult = previousResult;
                        if (requestCode === REQUEST_SELECT_IMAGE && resultCode === android.app.Activity.RESULT_OK) {
                            var selectedImage = data.getData();
                            currentBitmap = android.provider.MediaStore.Images.Media.getBitmap(
                                appModule.android.context.getContentResolver(),
                                selectedImage
                            );
                            resolve(imageSource.fromNativeSource(currentBitmap));
                            imageView.imageSource = imageSource.fromNativeSource(currentBitmap);
                        }
                    };
                    appModule.android.foregroundActivity.startActivityForResult(takePictureIntent, REQUEST_SELECT_IMAGE);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    viewModel.chooseLocation = function(locationLabel) {
        new Promise(function (resolve, reject) {
            try {
                var intentBuilder = new com.google.android.gms.location.places.ui.PlacePicker.IntentBuilder();
                var previousResult = appModule.android.onActivityResult;
                appModule.android.onActivityResult = function (requestCode, resultCode, data) {
                    appModule.android.onActivityResult = previousResult;
                    if (requestCode === REQUEST_LOCATION && resultCode === android.app.Activity.RESULT_OK) {
                        var place = com.google.android.gms.location.places.ui.PlacePicker.getPlace(data, appModule.android.context);
                        currentLocation = place.getLatLng();
                        locationLabel.text = place.getName();
                        resolve(place.getName());
                    }
                };
                appModule.android.foregroundActivity.startActivityForResult(intentBuilder.build(appModule.android.context), REQUEST_LOCATION);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    viewModel.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        viewModel.set("loggedIn",currentUser);
    }

    viewModel.addEvent = function (imageView, title, location, description, startDate, startTime, endDate, endTime, hashtags) {

        var inputError = validateInputs(title.text, description.text, startDate.text, startTime.text, endDate.text, endTime.text, hashtags.text);
        if (inputError == null) {

            if (checkAttachments()) {
                var viewedPhotos = {
                    "ig" : [],
                    "upload" : []
                };
                var imgurDeleteHash ={
                    "deleteHash" : "",
                    "id": ""
                };
                viewedPhotos = JSON.stringify(viewedPhotos);
                var eventObject = new com.parse.ParseObject("Event");
                eventObject.put("userId", applicationSettings.getString("currentUser"));
                eventObject.put("title", title.text);
                eventObject.put("locationTitle", location.text);
                eventObject.put("description", description.text);
                eventObject.put("start_date", startDate.text + " " + startTime.text);
                eventObject.put("end_date", endDate.text + " " + endTime.text);
                eventObject.put("hashtags", hashtags.text);
                eventObject.put("viewedPhotos", viewedPhotos);
                eventObject.put("imgurDeleteHash", "");
                eventObject.put("curIGUrl", "");
                var geoLocation = new com.parse.ParseGeoPoint(currentLocation.latitude, currentLocation.longitude);
                eventObject.put("location", geoLocation);
                var outputStream = new java.io.ByteArrayOutputStream();
                currentBitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
                var image = outputStream.toByteArray();
                var imageFile = new com.parse.ParseFile("image.png", image);
                eventObject.put("cover_photo", imageFile);
                http.request({
                    url: "https://api.imgur.com/3/album",
                    method: "POST",
                    headers: {
                        "Authorization" : "Client-ID " + config.imgurClientID,
                        "Content-Type" : "application/json"
                    },
                    content: JSON.stringify({
                        "title": title.text
                    })
                }).then(function(response){
                    var resp = response.content.toJSON();

                    imgurDeleteHash.deleteHash = resp.data.deletehash;
                    imgurDeleteHash.id = resp.data.id;
                    imgurDeleteHash = JSON.stringify(imgurDeleteHash);
                    eventObject.put("imgurDeleteHash", imgurDeleteHash);
                    eventObject.saveInBackground(new com.parse.SaveCallback({
                        done: function (error) {
                            android.widget.Toast.makeText(appModule.android.context, "Event uploaded!", 1).show();
                            //Clear input fields
                            title.text = "";
                            location.text = "";
                            description.text = "";
                            hashtags.text = "";
                            startDate.text = "";
                            startTime.text = "";
                            endDate.text  = "";
                            endTime.text = "";
                            currentLocation = null;
                            imageView.imageSource = null;
                        }
                    }));
                } , function(e){
                    console.log("imgur album was not created" + e);
                });
            }

        } else {
            android.widget.Toast.makeText(appModule.android.context, inputError, 0).show();
        }
    }

    return viewModel;
}

function validateInputs(title_text,
                        description_text,
                        startDate_text,
                        startTime_text,
                        endDate_text ,
                        endTime_text,
                        hashtags_text) {


    if (title_text == null || title_text == "") {
        return "Please fill in a title.";
    }

    if (description_text == null || description_text == "") {
        return "Please fill in a description.";
    }

    if (startDate_text == null || startDate_text == "") {
        return "Please fill in a start date.";
    }

    if (startTime_text == null || startTime_text == "") {
        return "Please fill in a start time.";
    }

    if (endDate_text == null || endDate_text == "") {
        return "Please fill in an end date.";
    }

    if (endTime_text == null || endTime_text == "") {
        return "Please fill in an end time.";
    }

    if (hashtags_text == null || hashtags_text == "") {
        return "Please give a hashtag";
    } else {
        if (hashtags_text.charAt(0) != "#") {
            return "First character needs to be a hashtag";
        }

        if (hashtags_text.split(" ").length > 1) {
            return "Only one hashtag allowed";
        }
    }

    return null;
}

function checkAttachments() {

    if (currentBitmap == null) {
        android.widget.Toast.makeText(appModule.android.context, "Please add a cover photo.", 0).show();
        return false;
    }

    if (currentLocation == null) {
        android.widget.Toast.makeText(appModule.android.context, "Please set a location", 0).show();
        return false;
    }

    return true;
}

module.exports = {
    CreateEventViewModel: CreateEventViewModel,
    validateInputs : validateInputs
};