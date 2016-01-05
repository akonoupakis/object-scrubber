var _ = require('underscore');

var Scrubber = function () {
    this.processors = [];
};

Scrubber.prototype.when = function (condition, fn) {
    if (typeof (condition) === 'function' && typeof (fn) === 'function') {
        this.processors.push({
            condition: condition,
            fn: fn
        });
    }
};

Scrubber.prototype.scrub = function (obj, parent) {
    var self = this;

    var result = obj;

    if (_.isArray(obj)) {
        _.find(obj, function (x, i) {
            var scrubbed = self.scrub(x);
            obj[i] = scrubbed || x;
        });
    }
    else if (_.isObject(obj)) {
        for (var objKey in obj) {

            var key = objKey;

            var flagCtx = {
                parent: obj,
                key: key,
                value: obj[key]
            };

            var processCtx = {
                parent: obj,
                key: key,
                value: obj[key],
                scrub: function (value) {
                    self.scrub(value);
                }
            }

            _.each(self.processors, function (processor) {
                if (processor.condition(flagCtx)) {
                    var res = processor.fn(processCtx);
                    key = processCtx.key;
                    if (res !== undefined)
                        obj[key] = res;
                }
            });
        }
        result = obj;
    }
    else {
        var flagCtx = {
            parent: null,
            key: null,
            value: obj
        };

        var processCtx = {
            parent: null,
            key: null,
            value: obj,
            scrub: function (value) {
                self.scrub(value);
            }
        }

        _.each(self.processors, function (processor) {
            if (processor.condition(flagCtx)) {
                var res = processor.fn(processCtx);
                if (res !== undefined) {
                    result = res;
                }
            }
        });
    }

    return result;
};

module.exports = function () {
    var scrubber = new Scrubber();
    return scrubber;
};