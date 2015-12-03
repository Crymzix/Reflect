/**
 * Created by Nguyen on 11/29/2015.
 */
var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");
var assert = require('assert');

describe('login-view', function() {
    var signup_view;
    var request;
    before(function () {
        request = sinon.stub();
        signup_view = proxyquire("../app/shared/view-models/login-view-model",
            {
                'request': request,
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }
            })
    });

    it('Signing up with a username that is not yet in use', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/users';
        var body = JSON.stringify({
            status: "201 Created"
        });
        request.withArgs(expectedEndpoint).yields(body,null);


        signup_view.signupLogic("nowayever@hotmail.ca","testfail").then(function(response){
            eexpect(response.code).to.equal(body.code);
        },function (e){
            expect(e).to.be.null;
        });
        done();


    });

    it('Signing up with a username that is not yet in use', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/users';
        var body = JSON.stringify({
            status: "201 Created"
        });
        request.withArgs(expectedEndpoint).yields(body,null);


        signup_view.signupLogic("nowayever@hotmail.ca","testfail").then(function(response){
            expect(response.code).to.equal(body.code);
        },function (e){
            expect(e).to.be.null;
        });
        done();


    });

    it('Signing up with a username but blank password', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/users';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        signup_view.signupLogic("nowayever@hotmail.ca","").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });

    it('Signing up with a blank username but non-empty password', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/users';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        signup_view.signupLogic("","yayou").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });

    it('Signing up with username that is already taken', function(done){
        var expectedEndpoint = 'https://api.parse.com/1/users';
        var body = JSON.stringify({
            "code": "102"
        });
        request.withArgs(expectedEndpoint).yields(null,body);


        signup_view.signupLogic("test@hotmail.ca","test").then(function(response){
            expect(response).to.be.null;
        },function (e){
            expect(e.code).to.equal(body.code);
        });
        done();


    });



});