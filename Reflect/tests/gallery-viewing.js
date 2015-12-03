/**
 * Created by Vineet on 2015-11-29.
 */
var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");
var PassThrough = require('stream').PassThrough;

describe('gallery-view-checkImgurStatusCode', function(){
    this.timeout(20000);
    var gallery_view;
    before(function(){
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
            "application":{
                ObservableArray: Array,
                '@noCallThru': true
            }})

    });


    it('should load/return JSON response from imgur if the status code is 200', function(done){
        var body = {
            "data": {
                "images_count": 4
            },
            "status": 200
        };

        var response;

        response = gallery_view.checkImgurStatusCode(body);

        expect(response.status).to.equal(200);
        done();

    });

    it('should return false status code is not 200', function(done){
        var body = {
            "data": {
            },
            "status" : 400
        };


        var response;

        response = gallery_view.checkImgurStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

    it('should return false status code is response is null', function(done){
        var body = null;


        var response;

        response = gallery_view.checkImgurStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

});

describe('gallery-view-checkParseStatusCode', function(){
    this.timeout(20000);
    var gallery_view;
    before(function(){
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should load/return JSON response from Parse if the statusCode is 200', function(done){
        var body = {
            "data": {
                "images_count": 4
            },
            "statusCode": 200
        };

        var response;

        response = gallery_view.checkParseStatusCode(body);

        expect(response.statusCode).to.equal(200);
        done();

    });

    it('should return false statusCode is not 200', function(done){
        var body = {
            "data": {
            },
            "statusCode" : 400
        };


        var response;

        response = gallery_view.checkParseStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

    it('should return false status code is response is null', function(done){
        var body = null;


        var response;

        response = gallery_view.checkParseStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

});

describe('gallery-view-checkImageCount', function(){
    this.timeout(20000);
    var gallery_view;
    before(function(){
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should return an image count > 0 if the album has images in it', function(done){
        var body = {
            "data": {
                "images_count": 4
            },
            "status": 200
        };


        var response;

        response = gallery_view.checkImageCount(body);

        expect(response).to.equal(4);
        done();

    });

    it('should return 0 if there are no images in album', function(done){
        var body = {
            "data": {
                "images_count": 0
            },
            "status": 200
        };


        var response;

        response = gallery_view.checkImageCount(body);

        expect(response).to.equal(0);
        done();
    });

    it('should return false status code is response is null', function(done){
        var body = null;


        var response;

        response = gallery_view.checkImageCount(body);

        expect(response).to.equal(false);
        done();
    });

});


describe('gallery-view-loadPictureArray', function(){
    this.timeout(20000);
    var gallery_view;
    before(function(){
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should return an array containing 2 images', function(done){
        var images = [];
        images[0] = {
            "id" : "a",
            "link" : "abc",
            "deletehash" : "abc123"
        };
        images[1] = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };


        var response;

        response = gallery_view.loadPicturesArray(images);

        expect(response.length).to.equal(2);
        done();

    });

    it('should return an array containing images with the fields Id, url, and deleteHash', function(done){
        var images = [];
        images[0] = {
            "id" : "a",
            "link" : "abc",
            "deletehash" : "abc123"
        };
        images[1] = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };


        var response;

        response = gallery_view.loadPicturesArray(images);

        expect(response[0].id).to.equal("a");
        expect(response[1].deleteHash).to.equal("def456");
        expect(response[1].url).to.equal("def");
        done();

    });

    it('should return null if response of images is null', function(done){
        var body = null;

        var response;

        response = gallery_view.loadPicturesArray(body);

        expect(response).to.equal(null);
        done();
    });

});

describe('gallery-view-shiftPhotos', function(){
    this.timeout(20000);
    var gallery_view;
    before(function(){
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should remove photo from middle of array and return an array information about picture array', function(done){
        var images = [];
        var imagesOne = {
            "id" : "a",
            "link" : "abc",
            "deletehash" : "abc123"
        };
        var imagesTwo = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };
        var imagesThree = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };
        images[0] = imagesOne; images[1] = imagesTwo; images[2] = imagesThree;

        var deleteImages = [];
        deleteImages[0] = imagesOne;
        deleteImages[1] = imagesThree;


        var response;

        response = gallery_view.shiftPhotos(images, 1, 3);

        expect(JSON.stringify(response.pictures)).to.equal(JSON.stringify(deleteImages));
        expect(response.picturePosition).to.equal(1);
        expect(response.pictureCount).to.equal(2);
        done();

    });

    it('should remove photo from end of array and return an array information about picture array', function(done){
        var images = [];
        var imagesOne = {
            "id" : "a",
            "link" : "abc",
            "deletehash" : "abc123"
        };
        var imagesTwo = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };
        var imagesThree = {
            "id" : "d",
            "link" : "def",
            "deletehash" : "def456"
        };
        images[0] = imagesOne; images[1] = imagesTwo; images[2] = imagesThree;

        var deleteImages = [];
        deleteImages[0] = imagesOne;
        deleteImages[1] = imagesTwo;


        var response;

        response = gallery_view.shiftPhotos(images, 2, 3);

        expect(JSON.stringify(response.pictures)).to.equal(JSON.stringify(deleteImages));
        expect(response.picturePosition).to.equal(1);
        expect(response.pictureCount).to.equal(2);
        done();

    });

    it('should return null if pictureCount >= picturePosition', function(done){

        var response;

        response = gallery_view.shiftPhotos(null, 2, 2);

        expect(response).to.equal(null);
        done();
    });

});

//describe('gallery-view-getParsePictureRequest', function(){
//    var gallery_view;
//    var request;
//    before(function(){
//        request = sinon.stub();
//        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
//            {'http': request,
//                "data/observable": {
//                    ObservableArray: Array,
//                    '@noCallThru': true
//                },
//            "application":{
//                ObservableArray: Array,
//                '@noCallThru': true
//            }})
//    });
//
//    it('should return parse picture JSON object', function(done){
//        var expectedEndpoint = "https://api.parse.com/1/classes/Event_Gallery?" + "photoURL=true?eventId=true?" ;
//
//        var body = JSON.stringify({
//            "imgurDeleteHash" : "a1b2c3"
//        });
//        request.withArgs(expectedEndpoint).yields(null, null, body);
//
//        gallery_view.getParsePictureRequest("3XP0K").then(function(response){
//            expect(response).to.equal(JSON.stringify({
//                "imgurDeleteHash" : "a1b2c3"
//            }));
//        },function (e){
//            expect(e).to.be.null;
//        });
//        done();
//    });
//
//    it('should return error for incorrect URL', function(done){

//        done();
//    });
//
//    it('should return no photos if the photo doesnt exist in parse', function(done){

//        done();
//    });
//
//
//});
//
//describe('gallery-view-deleteFromImgur', function(){
    //this.timeout(20000);
    //var gallery_view;
    //before(function(){
    //    this.request = sinon.stub(http, "request");
    //    gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
    //        {
    //            "data/observable": {
    //                ObservableArray: Array,
    //                '@noCallThru': true
    //            }})
    //});
    //
    //
    //it('should delete image from imgur for that gallery and return status code 200', function(done){
    //
    //    var body = JSON.stringify({
    //        "content" : {
    //            "status" : 200
    //        }
    //    });
    //
    //    var response = new PassThrough();
    //    response.write(body);
    //    response.end();
    //
    //    var request = new PassThrough();
    //    //var promiseStub = sinon.stub.resolves(body);
    //    //this.request.returns(promiseStub);
    //    this.request.returns(request);
    //
    //    gallery_view.deleteFromImgur("zzzzzz", function(err, result){
    //       expect(result).to.equal(JSON.parse(body));
    //        expect(err).to.be.null;
    //        done();
    //    });
    //});
    //
    //it('should return an error if URL for delete (image id) is incorrect', function(done){
    //    var expected = 'invalid URL';
    //    var request = new PassThrough();
    //
    //    this.request.returns(request);
    //
    //    gallery_view.deleteFromImgur(null, function(err) {
    //        expect(err).to.equal(expected);
    //        done();
    //    });
    //
    //    request.emit('error', expected);
    //});
    //
    //it('should return status code that is not 200 if photo could not be deleted', function(done){
    //    var body = JSON.stringify({
    //        "content" : {
    //            "status" : 400
    //        }
    //    });
    //
    //    //var error = new Error("Incorrect URL");
    //
    //    var response = new PassThrough();
    //    response.write(body);
    //    response.end();
    //
    //    var request = new PassThrough();
    //
    //    this.request.callsArgWith(0, response).returns(request);
    //
    //    gallery_view.deleteFromImgur("zzzzzz", function(err, result){
    //        expect(result).not.to.equal(200);
    //        expect(err).to.be.null;
    //        done();
    //    });
    //});

//});