(function () {
    var _;

    if (typeof (window) !== 'undefined')
        _ = window._;
    else
        _ = require("underscore");


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

    Scrubber.prototype.scrub = function (obj) {
        var self = this;

        var result = obj;

        if (_.isArray(obj)) {
            _.each(obj, function (x, i) {
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
                        processCtx.value = res;
                    }
                }
            });

            result = processCtx.value;
        }

        return result;
    };

    global = Scrubber;

    if (module)
        module.exports = Scrubber;

    if (typeof (window) !== 'undefined')
        window.ObjectScrubber = Scrubber;

}());
