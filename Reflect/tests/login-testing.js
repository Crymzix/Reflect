/**
 * Created by Nguyen on 11/29/2015.
 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");
var assert = require('assert');

describe('login-view', function() {
    var login_view;
    var request;
    before(function () {
        request = sinon.stub();
        login_view = proxyquire("../app/shared/view-models/login-view-model",
            {
                'request': request,
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }
            })
    });
    it('logging in with a correct username and password', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/login?username=test@hotmail.ca&password=test';
        var body = JSON.stringify({
            "objectId": "mvs6tQR1Hs"
        });
        request.withArgs(expectedEndpoint).yields(body,null);


        login_view.loginLogic("test@hotmail.ca","test").then(function(response){
            expect(response.objectId).to.equal(body.objectId);
        },function (e){
            expect(e).to.be.null;
        });
        done();


    });

    it('logging in with a correct username but incorrect password', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/login?username=test@hotmail.ca&password=test';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        login_view.loginLogic("test@hotmail.ca","testfail").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });

    it('logging in with an incorrect username', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/login?username=test@hotmail.ca&password=test';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        login_view.loginLogic("nowayever@hotmail.ca","testfail").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });

    it('logging in with null fields', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/login?username=test@hotmail.ca&password=test';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        login_view.loginLogic("","").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });


});