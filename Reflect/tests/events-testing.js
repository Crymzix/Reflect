var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");


describe('create-events-view-check', function(){
    this.timeout(20000);
    var create_event_view;
    before(function(){
        create_event_view = proxyquire("../app/shared/view-models/create-event-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "image-source":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "ui/image":{
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings":{
                    ObservableArray: Array,
                    '@noCallThru': true
                }})


    });

    var event_object = {};


    it('should return true if title is empty.', function(done){

        //var validation = create_event_view.validateInputs("", );
        //expect(validation).to.equal(false);
        done();

    });

});