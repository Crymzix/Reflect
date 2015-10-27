var observableModule = require("data/observable");
var imageSource = require("image-source");
var imageModule = require("ui/image");
var appModule = require("application");

var REQUEST_SELECT_IMAGE = 1234;

var CreateEventViewModel = (function (_super) {
    __extends(CreateEventViewModel, _super);
    function CreateEventViewModel() {
        _super.call(this);
        this.set("selectedViewIndex", 0);
    }

    CreateEventViewModel.prototype.selectView = function(index) {
        this.set("selectedViewIndex", index);
    };

    CreateEventViewModel.prototype.choosePhoto = function(imageView) {
        new Promise(function (resolve, reject) {
            try {
                var takePictureIntent = new android.content.Intent(android.content.Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                if (takePictureIntent.resolveActivity(appModule.android.context.getPackageManager()) != null) {
                    var previousResult = appModule.android.onActivityResult;
                    appModule.android.onActivityResult = function (requestCode, resultCode, data) {
                        appModule.android.onActivityResult = previousResult;
                        if (requestCode === REQUEST_SELECT_IMAGE && resultCode === android.app.Activity.RESULT_OK) {
                            var selectedImage = data.getData();
                            var bmp = android.provider.MediaStore.Images.Media.getBitmap(
                                appModule.android.context.getContentResolver(),
                                selectedImage
                            );
                            resolve(imageSource.fromNativeSource(bmp));
                            imageView.imageSource = imageSource.fromNativeSource(bmp);
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

    CreateEventViewModel.prototype.addEvent = function() {

    }

    return CreateEventViewModel;
})(observableModule.Observable);
exports.CreateEventViewModel = CreateEventViewModel;
