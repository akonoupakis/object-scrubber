var assert = require('assert');
var _ = require("underscore");

describe('Scrubber', function() {
  describe('scrub', function () {
    it('should return all fields suffixed with "_.processed!"', function () {

        var Scrubber = require('../object-scrubber.js');
    
        var testObj = {
            _id: 'test',
            title: 'test',
            collection: ['test1', 'test2']    
        };
                
        var scrubber = new Scrubber();

        scrubber.when(function (x) {
            return x.parent && x.key === '_id';
        }, function (x) {
            x.parent.id = x.value;
            delete x.parent._id;
            x.key = 'id';
            return x.scrub(x.parent.id);
        });

        scrubber.when(function (x) {
            return _.isArray(x.value);
        }, function (x) {
            x.scrub(x.value);
        });

        scrubber.when(function (x) {
            return typeof(x.value) === 'string';
        }, function (x) {
            return x.value + '_processed!';
        });

        scrubber.scrub(testObj);

        assert.equal('test_processed!', testObj.id);
        assert.equal('test_processed!', testObj.title);
        assert.equal('test1_processed!', testObj.collection[0]);
        assert.equal('test2_processed!', testObj.collection[1]);
    
    });
  });
});