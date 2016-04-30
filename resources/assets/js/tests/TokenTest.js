import { TestCase } from './TestCase.js';
import Token from '../language/Token.js';

/** Tests the Token class. */
export var TokenTest = function() {};

TokenTest.prototype = new TestCase();

TokenTest.prototype.setUp = function() {
    this.token = new Token('FOO', 'bar');
};

// REQ-ID: TOKEN_1
// TEST-ID: 1
TokenTest.prototype.it_is_a_Token = function() {
    this.assertTrue(this.token instanceof Token);
};

// REQ-ID: TOKEN_1
// TEST-ID: 2
TokenTest.prototype.it_has_a_type = function() {
    this.assertEqual(this.token.type, 'FOO');
};

// REQ-ID: TOKEN_1
// TEST-ID: 3
TokenTest.prototype.it_has_a_value = function() {
    this.assertEqual(this.token.value, 'bar');
};

// REQ-ID: TOKEN_1
// TEST-ID: 4
TokenTest.prototype.it_has_a_string_representation = function() {
    this.assertEqual(this.token.toString(), '<FOO, bar>');
};