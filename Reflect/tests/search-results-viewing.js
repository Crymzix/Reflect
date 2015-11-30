var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var config = require("../app/shared/config");

describe('search-results-viewing', function() {
	var searchTerm;
	var request;
	before (function(){
		request = sinon.stub();
		search_results_view = proxyquire("../app/shared/view-models/search-results-view-model",
		{'request': request,
		"data/observable-array":
			{
				ObservableArray: Array,
				'@noCallThru': true
			}
		})
	});
	it('should return a list of events', function(done){
		//var 
	}
	
	)
});