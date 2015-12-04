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
	
		it('array length should not equal 7', function(done){


        var response = [];
		var regexArray = [];
		var string = "hallo";
        response = search_view.matchString(string, 0, regexArray); 
		
	

        expect(response.length).to.not.equal(7);
        done();
	});
	
	it('test array content', function(done){


        var response = [];
		var regexArray = [];
		var string = "justin";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = [{"title":{"$regex":"J"}},{"title":{"$regex":"j"}},{"hashtags":{"$regex":"J"}},{"hashtags":{"$regex":"j"}},{"description":{"$regex":"J"}},{"description":{"$regex":"j"}}];

        expect(JSON.stringify(response)).to.equal(JSON.stringify(expectedResponse));
        done();
	});
	
	it('test first array value', function(done){


        var response = [];
		var regexArray = [];
		var string = "j";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = {"title":{"$regex":"J"}};

        expect(JSON.stringify(response[0])).to.equal(JSON.stringify(expectedResponse));
        done();
	});
	
		it('test array content', function(done){


        var response = [];
		var regexArray = [];
		var string = "jason";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = [{"title":{"$regex":"J"}},{"title":{"$regex":"j"}},{"hashtags":{"$regex":"J"}},{"hashtags":{"$regex":"j"}},{"description":{"$regex":"J"}},{"description":{"$regex":"j"}}];

        expect(JSON.stringify(response)).to.equal(JSON.stringify(expectedResponse));
        done();
	});
	
		it('test array content', function(done){


        var response = [];
		var regexArray = [];
		var string = "Justin";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = [{"title":{"$regex":"J"}},{"title":{"$regex":"j"}},{"hashtags":{"$regex":"J"}},{"hashtags":{"$regex":"j"}},{"description":{"$regex":"J"}},{"description":{"$regex":"j"}}];

        expect(JSON.stringify(response)).to.equal(JSON.stringify(expectedResponse));
        done();
	});
	
		it('test array content', function(done){


        var response = [];
		var regexArray = [];
		var string = "2";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = [{"title":{"$regex":"2"}},{"title":{"$regex":"2"}},{"hashtags":{"$regex":"2"}},{"hashtags":{"$regex":"2"}},{"description":{"$regex":"2"}},{"description":{"$regex":"2"}}];

        expect(JSON.stringify(response)).to.equal(JSON.stringify(expectedResponse));
        done();
	
	});
		it('test array content', function(done){


        var response = [];
		var regexArray = [];
		var string = "jfdlJedfsf";
        response = search_view.matchString(string, 0, regexArray); 
		
		var expectedResponse = [{"title":{"$regex":"J"}},{"title":{"$regex":"j"}},{"hashtags":{"$regex":"J"}},{"hashtags":{"$regex":"j"}},{"description":{"$regex":"J"}},{"description":{"$regex":"j"}}];

        expect(JSON.stringify(response)).to.equal(JSON.stringify(expectedResponse));
        done();
	});
	
});

