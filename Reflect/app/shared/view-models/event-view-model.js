var observableModule = require("data/observable");
var frameModule = require("ui/frame");
var config = require("../config");
var http = require("http");

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

        var eventObject = com.parse.ParseObject.createWithoutData("Event", event.objectId);
        console.log("event obj id " + event.objectId);
        try {
            eventObject = eventObject.fetchIfNeeded();
        } catch(e){
            console.log(e);
        }

        if(event.imgurDeleteHash == null || event.imgurDeleteHash == ""){
            getImgurAlbum(event.title).then(function(response){
                eventObject.put("imgurDeleteHash", JSON.stringify(response));
                eventObject.saveInBackground(new com.parse.SaveCallback({
                    done: function (error) {
                        event.imgurDeleteHash = JSON.stringify(response);
                    }
                }));
            }, function(e){
                    console.log(e);
                }
            );
        }
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

function getImgurAlbum(title){
    return new Promise(function(resolve, reject){
        var imgurDeleteHash ={
            "deleteHash" : "",
            "id": ""
        };
        http.request({
            url: "https://api.imgur.com/3/album",
            method: "POST",
            headers: {
                "Authorization" : "Client-ID " + config.imgurClientID,
                "Content-Type" : "application/json"
            },
            content: JSON.stringify({
                "title": title
            })
        }).then(function(response){
            var resp = response.content.toJSON();
            console.log(JSON.stringify(response));
            imgurDeleteHash.deleteHash = resp.data.deletehash;
            imgurDeleteHash.id = resp.data.id;
            resolve(imgurDeleteHash);
        }, function(e){
            reject("couldn't post album");
        });
    })

}

exports.EventViewModel = EventViewModel;