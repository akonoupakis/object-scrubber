# object-scrubber
> walks through an object and changes property names and values

![NPM VERSION](https://img.shields.io/npm/v/object-scrubber.svg)
![BOWER VERSION](https://img.shields.io/bower/v/object-scrubber.svg)
![DOWNLOADS](https://img.shields.io/npm/dt/object-scrubber.svg)
[![ISSUES](https://img.shields.io/github/issues-raw/akonoupakis/object-scrubber.svg)](https://github.com/akonoupakis/object-scrubber/issues)
![LICENCE](https://img.shields.io/npm/l/object-scrubber.svg)

[![NPM](https://nodei.co/npm/object-scrubber.png?downloads=true)](https://nodei.co/npm/object-scrubber/)

## overview

A simple recursive utility to scrub deep into objects and change their name and values.

## usage

```js
var Scrubber = require('object-scrubber');
    
var testObj = {
    _id: 'test',
    title: 'test',
    collection: ['test1', 'test2']    
};
        
var scrubber = new Scrubber();

// replacing "_id" properties to "id"
scrubber.when(function (x) {
    return x.parent && x.key === '_id';
}, function (x) {
    x.parent.id = x.value;
    delete x.parent._id;
    x.key = 'id';
    return x.scrub(x.parent.id);
});

// scrubbing arrays
scrubber.when(function (x) {
    return typeof(x.value) === 'object' && typeof(x.value.length) === 'function';
}, function (x) {
    x.scrub(x.value);
});

scrubber.when(function (x) {
    return typeof(x.value) === 'string';
}, function (x) {
    return x.value + '_processed!';
});

scrubber.scrub(testObj);
```

## license
```
The MIT License (MIT)

Copyright (c) 2016 akon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```