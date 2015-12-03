var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");
var PassThrough = require('stream').PassThrough;

describe('search match test', function(){
   
    var search_view;
    before(function(){
		search_view = proxyquire("../app/shared/view-models/search-view-model",
			{
				
            "data/observable": {
                ObservableArray: Array,
               '@noCallThru': true
                },
            "application":{
                ObservableArray: Array,
                '@noCallThru': true
            },
			"ui/frame":{
				ObservableArray: Array,
               '@noCallThru': true
			},
			"application-settings": {
				ObservableArray: Array,
               '@noCallThru': true
			}})
    });

    it('should return array of regular expressions ', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray);

        expect(response.status).to.equal([{"title":{"$regex":"Hallo"}},{"title":{"$regex":"hallo"}},{"hashtags":{"$regex":"Hallo"}},{"hashtags":{"$regex":"hallo"}},{"description":{"$regex":"Hallo"}},{"description":{"$regex":"hallo"}},{"title":{"$regex":"P"}},{"title":{"$regex":"p"}},{"hashtags":{"$regex":"P"}},{"hashtags":{"$regex":"p"}},{"description":{"$regex":"P"}},{"description":{"$regex":"p"}}]);
        done();
	});
});
