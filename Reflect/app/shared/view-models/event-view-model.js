var observableModule = require("data/observable");
var frameModule = require("ui/frame");

var EventViewModel = (function (_super) {
    __extends(EventViewModel, _super);

    var that;

    function EventViewModel(event) {
        _super.call(this);
        that = this;

        this.set("eventCoverPhoto", event.cover_photo.url);
        this.set("eventTitle", event.title);
        this.set("eventDate", event.start_date);
        this.set("eventLocation", event.location);
        this.set("eventDescription", event.description);
    }

    EventViewModel.prototype.upload = function(imageView) {

        var bitmap = imageView.imageSource.android;

        var outputStream = new java.io.ByteArrayOutputStream();
        bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
        var image = outputStream.toByteArray();
        var imageFile = new com.parse.ParseFile("image.png", image);
        imageFile.saveInBackground(new com.parse.SaveCallback({
            done: function (error) {

                console.log(imageFile.getUrl());

            }
        }));
    };

    EventViewModel.prototype.makeUploadVisible = function() {

    };

    return EventViewModel;
})(observableModule.Observable);
exports.EventViewModel = EventViewModel;