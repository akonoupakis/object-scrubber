var assert = require('assert');
var _ = require("underscore");

describe('Scrubber.scrub', function () {

    var Scrubber = require('../object-scrubber.js');

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
         return _.isObject(x.value);
    }, function (x) {
         return x.scrub(x.value);
    });    

    scrubber.when(function (x) {
        return typeof (x.value) === 'string';
    }, function (x) {
        return x.value + '_processed!';
    });

    describe('object - replacing property names from "_id" to "id" and suffixing all property values with "_processed!"', function () {

        var testObj = {
            _id: 'test',
            title: 'test',
            collection: ['test1', 'test2'],
            collection2: [{
                _id: 'test1',
                title: 'test1'            
            }, {
                _id: 'test2',
                title: 'test2'            
            }],
            sub: {
                _id: 'test',
                title: 'test',
                collection: ['test1', 'test2'],
                collection2: [{
                    _id: 'test1',
                    title: 'test1'            
                }, {
                    _id: 'test2',
                    title: 'test2'            
                }]
            }
        };
        
        scrubber.scrub(testObj);

        it('should replace property names from "_id" to "id"', function () {
            assert.equal(true, testObj.id !== undefined);
            assert.equal(true, _.all(testObj.collection2, function(x) { return x.id !== undefined; }));
            assert.equal(true, testObj.sub.id !== undefined);
            assert.equal(true, _.all(testObj.sub.collection2, function(x) { return x.id !== undefined; }));
        });
        
        it('should have removed properties with "_id" as name', function () {
            assert.equal(true, testObj._id === undefined);
            assert.equal(true, _.all(testObj.collection2, function(x) { return x._id === undefined; }));
            assert.equal(true, testObj.sub._id === undefined);
            assert.equal(true, _.all(testObj.sub.collection2, function(x) { return x._id === undefined; }));
        });
        
        it('should have suffixed property values with "_processed!"', function () {
            assert.equal(testObj.id, 'test_processed!');
            assert.equal(testObj.title, 'test_processed!');
            assert.equal(testObj.collection[0], 'test1_processed!');
            assert.equal(testObj.collection[1], 'test2_processed!');
            assert.equal(testObj.collection2[0].id, 'test1_processed!');
            assert.equal(testObj.collection2[1].id, 'test2_processed!');
            assert.equal(testObj.sub.id, 'test_processed!');
            assert.equal(testObj.sub.title, 'test_processed!');
            assert.equal(testObj.sub.collection[0], 'test1_processed!');
            assert.equal(testObj.sub.collection[1], 'test2_processed!');
            assert.equal(testObj.sub.collection2[0].id, 'test1_processed!');
            assert.equal(testObj.sub.collection2[1].id, 'test2_processed!');
        });
        
    });

    describe('array - replacing property names from "_id" to "id" and suffixing all property values with "_processed!"', function () {

        var testObjs = [{
            _id: 'test',
            title: 'test',
            collection: ['test1', 'test2'],
            collection2: [{
                _id: 'test1',
                title: 'test1'            
            }, {
                _id: 'test2',
                title: 'test2'            
            }],
            sub: {
                _id: 'test',
                title: 'test',
                collection: ['test1', 'test2'],
                collection2: [{
                    _id: 'test1',
                    title: 'test1'            
                }, {
                    _id: 'test2',
                    title: 'test2'            
                }]
            }
        }];

        scrubber.scrub(testObjs);

        it('should replace property names from "_id" to "id"', function () {
            assert.equal(true, testObjs[0].id !== undefined);
            assert.equal(true, _.all(testObjs[0].collection2, function(x) { return x.id !== undefined; }));
            assert.equal(true, testObjs[0].sub.id !== undefined);
            assert.equal(true, _.all(testObjs[0].sub.collection2, function(x) { return x.id !== undefined; }));
        });
        
        it('should have removed properties with "_id" as name', function () {
            assert.equal(true, testObjs[0]._id === undefined);
            assert.equal(true, _.all(testObjs[0].collection2, function(x) { return x._id === undefined; }));
            assert.equal(true, testObjs[0].sub._id === undefined);
            assert.equal(true, _.all(testObjs[0].sub.collection2, function(x) { return x._id === undefined; }));
        });
        
        it('should have suffixed property values with "_processed!"', function () {
            assert.equal(testObjs[0].id, 'test_processed!');
            assert.equal(testObjs[0].title, 'test_processed!');
            assert.equal(testObjs[0].collection[0], 'test1_processed!');
            assert.equal(testObjs[0].collection[1], 'test2_processed!');
            assert.equal(testObjs[0].collection2[0].id, 'test1_processed!');
            assert.equal(testObjs[0].collection2[1].id, 'test2_processed!');
            assert.equal(testObjs[0].sub.id, 'test_processed!');
            assert.equal(testObjs[0].sub.title, 'test_processed!');
            assert.equal(testObjs[0].sub.collection[0], 'test1_processed!');
            assert.equal(testObjs[0].sub.collection[1], 'test2_processed!');
            assert.equal(testObjs[0].sub.collection2[0].id, 'test1_processed!');
            assert.equal(testObjs[0].sub.collection2[1].id, 'test2_processed!');
        });
        
    });
});