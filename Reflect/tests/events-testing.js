var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");


describe('create-events-view-check', function () {
    this.timeout(20000);
    var create_event_view;
    before(function () {
        create_event_view = proxyquire("../app/shared/view-models/create-event-view-model",
            {
                "data/observable": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "image-source": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "ui/image": {
                    ObservableArray: Array,
                    '@noCallThru': true
                },
                "application-settings": {
                    ObservableArray: Array,
                    '@noCallThru': true
                }
            })


    });


    it('should return error string if title is empty.', function (done) {

        var validation = create_event_view.validateInputs("",
            "A test event",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "2:00",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if description is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "2:00",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if start date is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "",
            "1:00",
            "2016/01/01",
            "2:00",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if start time is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "",
            "2016/01/01",
            "2:00",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if end date is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "1:00",
            "",
            "2:00",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if end time is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "",
            "#hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return not error string if hashtag is empty.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "2:00",
            "");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if hashtag does not contain "#" symbol.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "2:00",
            "hashtag");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if hashtag has more than one word.', function (done) {

        var validation = create_event_view.validateInputs("A title",
            "A test event",
            "2015/01/01",
            "1:00",
            "2016/01/01",
            "2:00",
            "#hashtag hjbgjh");

        expect(validation).to.not.equal(null);
        done();

    });


    it('should return error string if all fields are empty.', function (done) {

        var validation = create_event_view.validateInputs("",
            "",
            "",
            "",
            "",
            "",
            "");

        expect(validation).to.not.equal(null);
        done();

    });

    it('should return error string if all fields are null or undefined.', function (done) {

        var validation = create_event_view.validateInputs(null,
            null,
            null,
            null,
            null,
            null,
            null);

        expect(validation).to.not.equal(null);
        done();

    });

});