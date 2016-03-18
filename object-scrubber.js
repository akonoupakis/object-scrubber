var _

/**
 * Represents the Scrubber class.
 * @constructor

* @property {array} processors - The processors injected
*/
var Scrubber = function () {
  this.processors = []
}

/**
   * Set a processor.

   * @param {function} condition - The condition passing a {@link Condition} instance as an argument (should return true/false)
   * @param {function} trigger - The trigger passing a {@link Trigger} instance as an argument (should return the scrubbed result)
   */
Scrubber.prototype.when = function (condition, trigger) {
  if (typeof (condition) === 'function' && typeof (trigger) === 'function') {
    this.processors.push({
      condition: condition,
      fn: trigger
    })
  }
}

/**
 * Scrub a target object.
 */
Scrubber.prototype.scrub = function (obj) {
  var self = this

  var result = obj

  if (_.isArray(obj)) {
    _.each(obj, function (x, i) {
      if (x) {
        var scrubbed = self.scrub(x)
        obj[i] = scrubbed || x
      }
    })
  } else if (_.isObject(obj)) {
    for (var objKey in obj) {
      var key = objKey

      var oflagCtx = new Condition(self, obj, key, obj[key])
      var oprocessCtx = new Trigger(self, obj, key, obj[key])

      _.each(self.processors, function (processor) {
        if (oflagCtx.value !== undefined && processor.condition(oflagCtx)) {
          var res = processor.fn(oprocessCtx)
          key = oprocessCtx.key
          if (res !== undefined) {
            obj[key] = res
          }
        }
      })
    }
    result = obj
  } else {
    var flagCtx = new Condition(self, null, null, obj)
    var processCtx = new Trigger(self, null, null, obj)

    _.each(self.processors, function (processor) {
      if (flagCtx.value !== undefined && processor.condition(flagCtx)) {
        var res = processor.fn(processCtx)
        if (res !== undefined) {
          processCtx.value = res
        }
      }
    })

    result = processCtx.value
  }

  return result
}

/**
 * Represents the condition function passed on the Scrubber.when.
 * @constructor

 * @param {Scrubber} sender - The sender scrubber
 * @param {object} parent - The parent object
 * @param {string} key - The property key
 * @param {any} value - The property value

 * @property {object} parent - The parent object
 * @property {string} key - The property key
 * @property {any} value - The property value
 */
var Condition = function (sender, parent, key, value) {
  this.scrubber = sender
  this.parent = parent
  this.key = key
  this.value = value
}

/**
 * Represents the trigger function passed on Scrubber.when.
 * @constructor

 * @param {Scrubber} sender - The sender scrubber
 * @param {object} parent - The parent object
 * @param {string} key - The property key
 * @param {any} value - The property value

 * @property {object} parent - The parent object
 * @property {string} key - The property key
 * @property {any} value - The property value
 */
var Trigger = function (sender, parent, key, value) {
  this.scrubber = sender
  this.parent = parent
  this.key = key
  this.value = value
}

/**
 * Trigger a scrub

 * @param {any} value - A value
 */
Trigger.prototype.scrub = function (value) {
  this.scrubber.scrub(value)
}

;(function () {
  if (typeof (window) !== 'undefined') {
    _ = window._
  } else {
    _ = require('underscore')
  }

  if (module) {
    module.exports = Scrubber
  }

  if (typeof (window) !== 'undefined') {
    window.ObjectScrubber = Scrubber
  }
}())
