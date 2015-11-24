var observableModule = require("data/observable");
var frameModule = require("ui/frame");

var EventViewModel = (function (_super) {
    __extends(EventViewModel, _super);

    var that;

    function EventViewModel(event) {
        _super.call(this);
        that = this;

        this.set("isOwner", event.isOwner);
        this.set("eventCoverPhoto", event.cover_photo.url);
        this.set("eventTitle", event.title);

        if (event.isOwner) {
            var eventStartDate = String(event.start_date).split(" ");
            var eventEndDate = String(event.end_date).split(" ");
            this.set("eventStartDate", eventStartDate[0]);
            this.set("eventStartTime", eventStartDate[1]);
            this.set("eventEndDate", eventEndDate[0]);
            this.set("eventEndTime", eventEndDate[1]);
        } else {
            this.set("eventStartDate", event.start_date);
            this.set("eventEndDate", event.end_date);
        }

        this.set("eventLocation", event.locationTitle);
        this.set("eventDescription", event.description);
        this.set("eventHashtag", event.hashtags);
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