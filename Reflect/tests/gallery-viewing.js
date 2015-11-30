/**
 * Created by Vineet on 2015-11-29.
 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");

describe('gallery-view', function(){
    var gallery_view;
    var request;
    before(function(){
        request = sinon.stub();
        gallery_view = proxyquire("../app/shared/view-models/gallery-viewing-view-model",
            {'request': request,
            "data/observable": {
                ObservableArray: Array,
                '@noCallThru': true
            }})
    });

    it('should load/return JSON images from imgur for that gallery', function(done){
        var expectedEndpoint = config.imgurAPI + "album/3XP0K";

        var body = JSON.stringify({
            "images_count" : 4
        });
        request.withArgs(expectedEndpoint).yields(null, null, body);

        gallery_view.loadFromImgur("3XP0K").then(function(response){
            expect(response).to.equal(JSON.stringify({
                "images_count" : 4
            }));
        },function (e){
            expect(e).to.be.null;
        });
        done();
    });

    it('should return an error if URL for request is incorrect', function(done){
        var expectedEndpoint = config.imgurAPI + "album/3XP0KSSSSSSS";

        var error = new Error("Incorrect URL");

        request.withArgs(expectedEndpoint).yields(error, null, null);

        gallery_view.loadFromImgur("3XP0K").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e).to.equal(error);
        });
        done();
    });

    it('should return no photos if the album is empty', function(done){
        var expectedEndpoint = config.imgurAPI + "album/3XP0KSSSSSSS";

        var error = new Error("Incorrect URL");

        var body = JSON.stringify({
            "images_count" : 0
        });
        request.withArgs(expectedEndpoint).yields(null, null, body);

        gallery_view.loadFromImgur("3XP0K").then(function(response){
            expect(response.data).to.be.null;
        },function (e){
            expect(e).to.be.null;
        });
        done();
    });


});