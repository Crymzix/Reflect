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

    it('signup should return an error if both fields are left blank.', function(done){
        var validation = signup_view.validateSignup(null,null);
        expect(validation).to.not.equal(null);
        done();
    });

    it('signup should return an error if the username field is left blank.', function(done){
        var validation = signup_view.validateSignup(null,"123");
        expect(validation).to.not.equal(null);
        done();
    });

    it('signup should return an error if the password field is left blank.', function(done){
        var validation = signup_view.validateSignup("yoloswag",null);
        expect(validation).to.not.equal(null);
        done();
    });

    it('signup should return an error if the user already exists', function(done){
        var JSONarray = [
            {
                "createdAt": "2015-10-29T04:55:19.296Z",
                "email": "test@mail.com",
                "objectId": "V34Styi1V2",
                "updatedAt": "2015-10-29T04:55:19.296Z",
                "username": "test@mail.com"
            }
        ];
        var validation = signup_view.checkDuplicate("test@mail.com",JSONarray,1);
        expect(validation).to.not.equal(null);

        done();
    });

    it('signup should not return an error if the user doesnt already exist', function(done){
        var JSONarray2 = [
            {
                "createdAt": "2015-10-29T04:55:19.296Z",
                "email": "test@mail.com",
                "objectId": "V34Styi1V2",
                "updatedAt": "2015-10-29T04:55:19.296Z",
                "username": "test@mail.com"
            }
        ];
        var validation = signup_view.checkDuplicate("nonexistent@mail.com",JSONarray2,1);
        expect(validation).to.be.null;
        done();
    });



});