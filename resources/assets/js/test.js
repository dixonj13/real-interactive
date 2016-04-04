var $ = require('jquery');
import * as TokenTest from './tests/TokenTest.js';
import * as LexerTest from './tests/LexerTest.js';
import * as ParserTest from './tests/ParserTest.js';
import * as AstTest from './tests/AstTest.js';

var TestObject = function() {
    this.TokenTest = new TokenTest.TokenTest();
    this.LexerTest = new LexerTest.LexerTest();
    this.ParserTest = new ParserTest.ParserTest();
    this.AstTest = new AstTest.AstTest();
};

$(function() {
    var tests = new TestObject();
    for (var test in tests) {
        tests[test].run();
    }
});

