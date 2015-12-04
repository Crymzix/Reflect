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

    it('login should return an error if both fields are left blank.', function(done){
        var validation = login_view.validateLogin(null,null);
        expect(validation).to.not.equal(null);
        done();
    });

    it('login should return an error if the username field is left blank.', function(done){
        var validation = login_view.validateLogin(null,"123");
        expect(validation).to.not.equal(null);
        done();
    });

    it('login should return an error if the password field is left blank.', function(done){
        var validation = login_view.validateLogin("yoloswag",null);
        expect(validation).to.not.equal(null);
        done();
    });


});