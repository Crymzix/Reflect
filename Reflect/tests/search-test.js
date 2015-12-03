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

    it('shouldnt give null result', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray); 
		
		// searchInput = ("hallo", 0, regexArray);

        expect(response).to.not.equal(null);
        done();
	});
	
	    it('shouldnt return a length of 5', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray); 
		
		//var searchInput = ("hallo", 0, regexArray);

        expect(response.length).to.not.equal(5);
        done();
	});
	
		it('should return array of regular expressions ', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray); 
		
	

        expect(response.length).to.not.equal(7);
        done();
	});
	
	it('shouldnt give null result', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray); 


        expect(response.length).to.equal(6);
        done();
	});
});

