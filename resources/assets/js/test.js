import { TokenTest } from './tests/TokenTest';
import { LexerTest } from './tests/LexerTest';
import { ParserTest } from './tests/ParserTest';
import { AstTest } from './tests/AstTest';
import { RelationTest } from './tests/RelationTest';
import { EngineTest } from './tests/EngineTest';

var TestObject = function() {
    this.TokenTest = new TokenTest();
    this.LexerTest = new LexerTest();
    this.ParserTest = new ParserTest();
    this.AstTest = new AstTest();
    this.RelationTest = new RelationTest();
    this.EngineTest = new EngineTest();
};

var tests = new TestObject();

var num = 0;
var start = performance.now();

for (var test in tests) {
    num += tests[test].run();
}

var end = performance.now();

console.log(`Ran ${num} tests in ${(end - start).toFixed(3)} ms.`);
