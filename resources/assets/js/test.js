import { TokenTest } from './tests/TokenTest.js';
import { LexerTest } from './tests/LexerTest.js';
import { ParserTest } from './tests/ParserTest.js';
import { AstTest } from './tests/AstTest.js';

var TestObject = function() {
    this.TokenTest = new TokenTest();
    this.LexerTest = new LexerTest();
    this.ParserTest = new ParserTest();
    this.AstTest = new AstTest();
};

var tests = new TestObject();

for (var test in tests) {
    tests[test].run();
}

