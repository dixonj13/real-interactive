import { TestCase } from './TestCase.js';
import Token from '../language/Token.js';

/** Tests the Token class. */
export var TokenTest = function() {};

TokenTest.prototype = new TestCase();

TokenTest.prototype.setUp = function() {
    this.token = new Token('FOO', 'bar');
};

TokenTest.prototype.it_is_a_Token = function() {
    this.assertTrue(this.token instanceof Token);
};

TokenTest.prototype.it_has_a_type = function() {
    this.assertStrictlyEqual(this.token.type, 'FOO');
};

TokenTest.prototype.it_has_a_value = function() {
    this.assertStrictlyEqual(this.token.value, 'bar');
};

TokenTest.prototype.it_has_a_string_representation = function() {
    this.assertStrictlyEqual(this.token.toString(), '<FOO, bar>');
};