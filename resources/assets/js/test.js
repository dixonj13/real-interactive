import { TokenTest } from './tests/TokenTest';
import { LexerTest } from './tests/LexerTest';
import { ParserTest } from './tests/ParserTest';
import { AstTest } from './tests/AstTest';
import { OperationsTest } from './tests/OperationsTest';

var TestObject = function() {
    this.TokenTest = new TokenTest();
    this.LexerTest = new LexerTest();
    this.ParserTest = new ParserTest();
    this.AstTest = new AstTest();
    this.OperationsTest = new OperationsTest();
};

var tests = new TestObject();

for (var test in tests) {
    tests[test].run();
}

