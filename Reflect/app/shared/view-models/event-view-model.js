var observableModule = require("data/observable");
var frameModule = require("ui/frame");
var config = require("../config");
var http = require("http");
var appModule = require("application");


var EventViewModel = (function (_super) {
    __extends(EventViewModel, _super);

    var that;

    function EventViewModel(event) {
        _super.call(this);
        this._event = event;
        that = this;

        this.set("isOwner", event.isOwner);
        this.set("eventCoverPhoto", event.cover_photo.url);
        this.set("eventTitle", event.title);

        if (event.isGalleryPublished) {
          if (event.isGalleryPublished == "1") {
              this.set("isGalleryPublished", true);
          } else {
              this.set("isGalleryPublished", false);
          }
        } else {
            this.set("isGalleryPublished", false);
        }

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

        if (imageView.imageSource) {

            //var progressDialog = new android.app.ProgressDialog(appModule.android.context);
            //progressDialog.setMessage("Uploading photo");
            //progressDialog.setCancelable(false);
            //progressDialog.show();

            var bitmap = imageView.imageSource.android;

            var outputStream = new java.io.ByteArrayOutputStream();
            bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
            var image = outputStream.toByteArray();
            var imageFile = new com.parse.ParseFile("image.png", image);
            imageFile.saveInBackground(new com.parse.SaveCallback({
                done: function (error) {
                    var eventObject = new com.parse.ParseObject("Event_Gallery");
                    eventObject.put("eventId", that._event.objectId);
                    eventObject.put("photoUrl",imageFile.getUrl());
                    eventObject.put("userUpload1", "1");
                    eventObject.saveInBackground(new com.parse.SaveCallback({
                        done: function (error) {
                            console.log("Saved image.");
                            android.widget.Toast.makeText(appModule.android.context, "Uploaded photo", 0).show();
                            imageView.imageSource = null;
                        }
                    }));
                }
            }));
        } else {
            android.widget.Toast.makeText(appModule.android.context, "Please take a picture to upload.", 0).show();
        }
    };

    EventViewModel.prototype.makeUploadVisible = function() {

    };

    EventViewModel.prototype.showLocation = function() {

        var event = this._event;
        var uri = "geo:" + event.location.latitude + "," + event.location.longitude;
        var mapIntent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(uri));
        appModule.android.foregroundActivity.startActivity(mapIntent);
    };

    EventViewModel.prototype.save = function(imageView, title, location, description, startDate, startTime, endDate, endTime, hashtags) {

        var eventObject = com.parse.ParseObject.createWithoutData("Event", this._event.objectId);
        eventObject.put("title", title.text);
        eventObject.put("locationTitle", location.text);
        eventObject.put("description", description.text);
        eventObject.put("start_date", startDate.text + " " + startTime.text);
        eventObject.put("end_date", endDate.text + " " + endTime.text);
        eventObject.put("hashtags", hashtags.text);
        eventObject.saveInBackground(new com.parse.SaveCallback({
            done: function (error) {
                android.widget.Toast.makeText(appModule.android.context, "Saved changes.", 0).show();
            }
        }));
    };

    EventViewModel.prototype.publish = function() {

        var eventObject = com.parse.ParseObject.createWithoutData("Event", this._event.objectId);
        eventObject.put("isGalleryPublished", "1");
        eventObject.saveInBackground(new com.parse.SaveCallback({
            done: function (error) {
                that.set("isGalleryPublished", true);
                this._event.isGalleryPusblished = "1";
                android.widget.Toast.makeText(appModule.android.context, "Published gallery!", 0).show();
            }
        }));
    };

    EventViewModel.prototype.viewGallery = function() {

        if (this._event.isGalleryPublished) {
            if (this._event.isGalleryPublished == "1") {

                if (this._event.imgurDeleteHash) {
                    var json = JSON.parse(this._event.imgurDeleteHash);
                    var uri = "http://imgur.com/a/" + json.id;
                    var webIntent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(uri));
                    appModule.android.foregroundActivity.startActivity(webIntent);
                }
            }
        }
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