var _ = require('lodash/lang');

/**
 * General TestCase which provides the ability to run
 * test methods, and provides assertions.
 */
export var TestCase = function() {};

/**
 * Runner calls all test methods.
 * To denote a test method, prepend 'it_' or 'test_' to the method name.
 * @returns {integer} Number of tests run.
 */
TestCase.prototype.run = function() {
    var num = 0;
    for (var p in this) {
        if (typeof this[p] == 'function' && 
            (p.substr(0, 3) == 'it_' || p.substr(0, 5) == 'test_')) {
            this.setUp();
            this[p]();
            this.tearDown();
            num++;
        }
    }
    return num;
};

/**
 * setUp is called before the execution of each test method.
 * Extend this method to set up a test environment.
 */
TestCase.prototype.setUp = function() {
    // stub
};

/**
 * tearDown is called after the execution of each test method.
 * Extend this method to tear down a test environment.
 */
TestCase.prototype.tearDown = function() {
    // stub
};

/**
 * Asserts that x and y are equal.
 * @param {*} x 
 * @param {*} y 
 */
TestCase.prototype.assertEqual = function(x, y) {
    if ( ! _.isEqual(x, y) ) {
        var e = new Error(`Assertion failed; Expected ${x} to be equal to ${y}!`);
        console.log(e.stack);
    }
};

/**
 * Asserts that x and y are not equal.
 * @param {*} x 
 * @param {*} y 
 */
TestCase.prototype.assertNotEqual = function(x, y) {
    if (_.isEqual(x, y) ) {
        var e = new Error(`Assertion failed; Expected ${x} not to be equal to ${y}!`);
        console.log(e.stack);
    }
};

/**
 * Asserts that x evaluates to true.
 * @param {Boolean} x
 */
TestCase.prototype.assertTrue = function(x) {
    if (!x) {
        var e = new Error(`Assertion failed; Expected true but received false!`);
        console.log(e.stack);
    }
};

/**
 * Asserts that x evaluates to false.
 * @param {Boolean} x 
 */
TestCase.prototype.assertFalse = function(x) {
    if (x) {
        var e = new Error(`Assertion failed; Expected false but received true!`);
        console.log(e.stack);
    }
};

/**
 * Asserts that x is strictly equivalent to null.
 * @param {*} x 
 */
TestCase.prototype.assertNull = function(x) {
    if (x !== null) {
        var e = new Error(`Assertion failed; Expected null but received ${x}!`);
        console.log(e.stack);
    }
};

/**
 * Asserts that x is strictly inequivalent to null.
 * @param {*} x 
 */
TestCase.prototype.assertNotNull = function(x) {
    if (x === null) {
        var e = new Error(`Assertion failed; Expected a non-null value but received null!`);
        console.log(e.stack);
    }
};

/**
 * Expects that calling fn will result in a thrown error.
 * If msg is not null, then expects that msg will be the 
 * thrown error message.
 * @param  {Function} fn  
 * @param  {string}   msg 
 */
TestCase.prototype.expectError = function(fn, msg = null) {
    try {
        fn.call(); 
    } catch(e) {
        if (msg) {
            if (msg === e.message)
                return;
            else {
                var ex = new Error(`Assertion failed; Expected error message was "${msg}" 
                    but actual message was "${e.message}"`);
                console.log(ex.stack);
            }
        }
        return;
    }
    var e = new Error(`Assertion failed; Expected an error but none thrown!`);
    console.log(e.stack);
};


