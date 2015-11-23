var observableModule = require("data/observable");
var imageSource = require("image-source");
var imageModule = require("ui/image");
var appModule = require("application");
var applicationSettings = require("application-settings");

var REQUEST_SELECT_IMAGE = 1234;
var currentBitmap;

var CreateEventViewModel = (function (_super) {
    __extends(CreateEventViewModel, _super);
    function CreateEventViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    CreateEventViewModel.prototype.selectView = function (index) {
        this.set("selectedViewIndex", index);
    };

    CreateEventViewModel.prototype.choosePhoto = function (imageView) {
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
    };

    CreateEventViewModel.prototype.checkLoggedIn = function(){
        var currentUser = applicationSettings.hasKey("currentUser");
        this.set("loggedIn",currentUser);
    };

    CreateEventViewModel.prototype.addEvent = function (imageView, title, location, description, date, time, hashtags) {

        if (title.text && location.text && description.text && date.text && time.text) {
            var viewedPhotos = {
                "ig" : [],
                "upload" : []
            };
            viewedPhotos = JSON.stringify(viewedPhotos);
            var eventObject = new com.parse.ParseObject("Event");
            eventObject.put("userId", applicationSettings.getString("currentUser"));
            eventObject.put("title", title.text);
            eventObject.put("location", location.text);
            eventObject.put("description", description.text);
            eventObject.put("start_date", date.text + " " + time.text);
            eventObject.put("hashtags", hashtags.text);
            eventObject.put("viewedPhotos", viewedPhotos);
            eventObject.put("imgurDeleteHash", "");
            eventObject.put("curIGUrl", "");
            var outputStream = new java.io.ByteArrayOutputStream();
            currentBitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
            var image = outputStream.toByteArray();
            var imageFile = new com.parse.ParseFile("image.png", image);
            eventObject.put("cover_photo", imageFile);
            eventObject.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    //Clear input fields
                    title.text = "";
                    location.text = "";
                    description.text = "";
                    date.text = "";
                    time.text = "";
                    hashtags.text = "";
                    imageView.imageSource = null;
                }
            }));
        } else {
            console.log("Fill in all fields");
        }
    };

    return CreateEventViewModel;
})(observableModule.Observable);
exports.CreateEventViewModel = CreateEventViewModel;
