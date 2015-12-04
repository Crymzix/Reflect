/**
 * Created by Vineet on 2015-12-02.
 */
var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");
var PassThrough = require('stream').PassThrough;

describe('gallery-visitPhoto', function(){
    this.timeout(20000);
    var gallery;
    before(function(){
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should return an array of visited photos with the new photo being from Instagram', function(done){
        var uploadIds = [1, 2, 3];
        var body = {
            "upload": uploadIds,
            "ig": uploadIds
        };

        var response;

        response = gallery.visitPhoto(4, 0, body);
        uploadIds.push(4);
        expect(response.upload).to.equal(uploadIds);
        done();

    });

    it('should return an array of visited photos with the new photo being from Parse', function(done){
        var uploadIds = [1, 2, 3];
        var body = {
            "upload": uploadIds,
            "ig": uploadIds
        };

        var response;

        response = gallery.visitPhoto(4, 1, body);
        uploadIds.push(4);
        expect(response.upload).to.equal(uploadIds);
        done();

    });

});

describe('gallery-findIfVisited', function(){
    this.timeout(20000);
    var gallery;
    before(function(){
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should return false if photo id for IG photo not in visited array', function(done){
        var uploadId = 1 ;
        var visitedIds = [];
        var body = {
            "upload": visitedIds,
            "ig": visitedIds
        };

        var response;

        response = gallery.findIfVisited(uploadId, 0, body);
        expect(response).to.equal(false);
        done();

    });

    it('should return false if photo id for Parse photo not in visited array', function(done){
        var uploadId = 1 ;
        var visitedIds = [];
        var body = {
            "upload": visitedIds,
            "ig": visitedIds
        };

        var response;

        response = gallery.findIfVisited(uploadId, 1, body);
        expect(response).to.equal(false);
        done();

    });

    it('should return true if photo id for Instagram photo in visited array', function(done){
        var uploadId = 1 ;
        var visitedIds = [1];
        var body = {
            "upload": visitedIds,
            "ig": visitedIds
        };

        var response;

        response = gallery.findIfVisited(uploadId, 0, body);
        expect(response).to.equal(true);
        done();

    });

    it('should return false if visitedphotos array null', function(done){
        var uploadId = 1 ;

        var response;

        response = gallery.findIfVisited(uploadId, 0, null);
        expect(response).to.equal(false);
        done();

    });

});

describe('gallery-checkIGStatusCode', function() {
    this.timeout(20000);
    var gallery;
    before(function () {
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }
            })

    });


    it('should load/return JSON response from Instagram if the status code is 200', function (done) {
        var body = {
            "meta":{
                "code": 200
            }
        };

        var response;

        response = gallery.checkIGStatusCode(body);

        expect(response.meta.code).to.equal(200);
        done();

    });

    it('should return false status code is not 200', function (done) {
        var body = {
            "meta":{
                "code": 400
            }
        };


        var response;

        response = gallery.checkIGStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

    it('should return false status code is response is null', function (done) {
        var body = null;


        var response;

        response = gallery.checkIGStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

});

describe('gallery-view-checkImgurStatusCode', function(){
    this.timeout(20000);
    var gallery;
    before(function(){
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
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

        response = gallery.checkImgurStatusCode(body);

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

        response = gallery.checkImgurStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

    it('should return false status code is response is null', function(done){
        var body = null;


        var response;

        response = gallery.checkImgurStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

});

describe('gallery-view-checkParseStatusCode', function(){
    this.timeout(20000);
    var gallery;
    before(function(){
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
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

        response = gallery.checkParseStatusCode(body);

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

        response = gallery.checkParseStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

    it('should return false status code is response is null', function(done){
        var body = null;


        var response;

        response = gallery.checkParseStatusCode(body);

        expect(response).to.equal(false);
        done();
    });

});

describe('gallery-loadIGPicturesArray', function(){
    this.timeout(20000);
    var gallery;
    before(function(){
        gallery = proxyquire("../app/shared/view-models/gallery-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }})

    });


    it('should load all photos in array with no visited photos', function(done){
        var visitedIds = [];
        var visited = {
            "upload": visitedIds,
            "ig": visitedIds
        };
        var data = [];
        data[0] = {
            "images" : {
                "standard_resolution" :{
                    "url" :"abc"
                }
            },
            "id" : 0
        };
        data[1] = {
            "images" : {
                "standard_resolution" :{
                    "url" :"def"
                }
            },
            "id" : 1
        };
        var body = {
            "data" : data
        };

        var response;


        response = gallery.loadIGPicturesArray(body, visited);
        expect(response[0].id).to.equal(0);
        expect(response[1].url).to.equal("def");
        done();

    });

    it('should load only photos in array with no visited photos', function(done){
        var visitedIds = [1];
        var visited = {
            "upload": visitedIds,
            "ig": visitedIds
        };
        var data = [];
        data[0] = {
            "images" : {
                "standard_resolution" :{
                    "url" :"abc"
                }
            },
            "id" : 0
        };
        data[1] = {
            "images" : {
                "standard_resolution" :{
                    "url" :"def"
                }
            },
            "id" : 1
        };
        var body = {
            "data" : data
        };

        var response;


        response = gallery.loadIGPicturesArray(body, visited);
        expect(response[0].id).to.equal(0);
        expect(response.length).to.equal(1);
        done();

    });

    it('should return empty array if response is null', function(done){
        var visited = [];
        var body = null;

        var response;

        response = gallery.loadIGPicturesArray(body, visited);
        expect(response.length).to.equal(0);
        done();

    });


});