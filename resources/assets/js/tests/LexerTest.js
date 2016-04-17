import { TestCase } from './TestCase';
import Lexer from '../language/Lexer';
import Token from '../language/Token';
import { tokenTypes } from '../language/TokenTypes';

/** Tests the Lexer class. */
export var LexerTest = function() {};

LexerTest.prototype = new TestCase();

LexerTest.prototype.setUp = function() {
    this.lexer = new Lexer('foo');
};

LexerTest.prototype.it_is_a_Lexer = function() {
    this.assertTrue(this.lexer instanceof Lexer);
};

LexerTest.prototype.it_contains_text = function() {
    this.assertStrictlyEqual('foo', this.lexer.text);
};

LexerTest.prototype.it_has_a_position_within_the_text_start_at_0 = function() {
    this.assertStrictlyEqual(0, this.lexer.pos);
};

LexerTest.prototype.it_has_a_character_starting_at_the_first_character_in_the_text = function() {
    this.assertStrictlyEqual('f', this.lexer.char);
};

LexerTest.prototype.it_has_a_finite_list_of_available_token_types = function() {
    this.assertStrictlyEqual('EOF', tokenTypes.EOF);
    this.assertStrictlyEqual('RELATION', tokenTypes.RELATION);
    this.assertStrictlyEqual('ID', tokenTypes.ID);
    this.assertStrictlyEqual('NUMBER', tokenTypes.NUMBER);
    this.assertStrictlyEqual('STRING', tokenTypes.STRING);
    this.assertStrictlyEqual('ATTR', tokenTypes.ATTR);
    this.assertStrictlyEqual('LIST', tokenTypes.LIST);
    this.assertStrictlyEqual('(', tokenTypes.LPAREN);
    this.assertStrictlyEqual(')', tokenTypes.RPAREN);
    this.assertStrictlyEqual('[', tokenTypes.LBRACK);
    this.assertStrictlyEqual(']', tokenTypes.RBRACK);
    this.assertStrictlyEqual('DOT', tokenTypes.DOT);
    this.assertStrictlyEqual('COMMA', tokenTypes.COMMA);
    this.assertStrictlyEqual('NJOIN', tokenTypes.NJOIN);
    this.assertStrictlyEqual('SELECT', tokenTypes.SELECT);
    this.assertStrictlyEqual('PROJECT', tokenTypes.PROJECT);
    this.assertStrictlyEqual('RENAME', tokenTypes.RENAME);
    this.assertStrictlyEqual('UNION', tokenTypes.UNION);
    this.assertStrictlyEqual('ISECT', tokenTypes.ISECT);
    this.assertStrictlyEqual('DIFF', tokenTypes.DIFF);
    this.assertStrictlyEqual('CPROD', tokenTypes.CPROD);
    this.assertStrictlyEqual('AND', tokenTypes.AND);
    this.assertStrictlyEqual('OR', tokenTypes.OR);
    this.assertStrictlyEqual('NOT', tokenTypes.NOT);
    this.assertStrictlyEqual('MINUS', tokenTypes.MINUS);
    this.assertStrictlyEqual('GRTR', tokenTypes.GRTR);
    this.assertStrictlyEqual('GEQ', tokenTypes.GEQ);
    this.assertStrictlyEqual('EQL', tokenTypes.EQL);
    this.assertStrictlyEqual('NEQ', tokenTypes.NEQ);
    this.assertStrictlyEqual('LESS', tokenTypes.LESS);
    this.assertStrictlyEqual('LEQ', tokenTypes.LEQ);
};

LexerTest.prototype.it_can_consume_incrementing_the_position_and_getting_the_next_character = function() {
    this.assertStrictlyEqual(0, this.lexer.pos);
    this.assertStrictlyEqual('f', this.lexer.char);
    this.lexer.consume();
    this.assertStrictlyEqual(1, this.lexer.pos);
    this.assertStrictlyEqual('o', this.lexer.char);
};

LexerTest.prototype.it_sets_the_character_to_null_if_there_is_nothing_else_to_consume = function() {
    this.lexer = new Lexer('z');
    this.assertNotNull(this.lexer.char);
    this.lexer.consume();
    this.assertNull(this.lexer.char);
};

LexerTest.prototype.it_returns_an_EOF_token_when_coming_at_the_end_of_input = function() {
    this.lexer = new Lexer('x');

    this.lexer.consume();
    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<EOF, null>', token.toString());
};

LexerTest.prototype.it_can_eat_the_white_space_between_characters = function() {
    this.lexer = new Lexer('a   b \t c \n d \r e');

    this.lexer.consume();
    this.assertStrictlyEqual(' ', this.lexer.char);
    this.assertStrictlyEqual(1, this.lexer.pos);

    this.lexer.whitespace();
    this.assertStrictlyEqual('b', this.lexer.char);
    this.assertStrictlyEqual(4, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertStrictlyEqual('c', this.lexer.char);
    this.assertStrictlyEqual(8, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertStrictlyEqual('d', this.lexer.char);
    this.assertStrictlyEqual(12, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertStrictlyEqual('e', this.lexer.char);
    this.assertStrictlyEqual(16, this.lexer.pos);
};

LexerTest.prototype.it_can_parse_a_ID_of_alpha_numeric_chars_and_underscores_not_starting_with_a_digit = function() {
    this.lexer = new Lexer('foo._bAR12(B__A_Z_\tQ_1_u_2_X_3;n0rF___');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ID, foo>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ID, _bAR12>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ID, B__A_Z_>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ID, Q_1_u_2_X_3>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ID, n0rF___>', token.toString());
    this.lexer.consume();
};

LexerTest.prototype.it_can_parse_a_NUMBER_made_of_digits_not_starting_with_0 = function() {
    this.lexer = new Lexer('12a3456\r789!987654321012345');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NUMBER, 12>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NUMBER, 3456>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NUMBER, 789>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NUMBER, 987654321012345>', token.toString());
};

LexerTest.prototype.it_can_parse_a_string_between_two_double_quotes = function() {
    this.lexer = new Lexer('"`~!@#$%^&*()[]{}<>/,._-+=| 123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<STRING, `~!@#$%^&*()[]{}<>/,._-+=| 123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ>',
        token.toString());
};

LexerTest.prototype.it_throws_an_error_when_parsing_an_unclosed_string = function() {
    this.lexer = new Lexer('"unclosed');
    this.expectError(function() { this.nextToken(); }.bind(this.lexer), 
        'String starting at position 0 is not closed');
};

LexerTest.prototype.it_can_parse_left_and_right_parens_and_brackets_as_tokens = function() {
    this.lexer = new Lexer('()[]');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<(, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<), null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<[, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<], null>', token.toString());
};

LexerTest.prototype.it_can_parse_commas_and_periods_as_tokens = function() {
    this.lexer = new Lexer('.,.,');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<DOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<COMMA, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<DOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<COMMA, null>', token.toString());
};

LexerTest.prototype.it_can_parse_set_operators_as_tokens = function() {
    this.lexer = new Lexer('⨝σΠπρ∪∩−×∧∨¬-!!=>>=≥=≠<<=≤');

    var token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NJOIN, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<SELECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<PROJECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<PROJECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<RENAME, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<UNION, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<ISECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<DIFF, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<CPROD, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<AND, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<OR, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<MINUS, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<GRTR, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<GEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<GEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<EQL, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<NEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<LESS, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<LEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertStrictlyEqual('<LEQ, null>', token.toString());
};

LexerTest.prototype.it_throws_an_error_for_tokens_starting_with_a_zero = function() {
    this.lexer = new Lexer('0a123');
    this.expectError(function() { this.nextToken(); }.bind(this.lexer),
        'Invalid character: 0 at position 0');
};

LexerTest.prototype.it_errors = function() {
    this.lexer = new Lexer('%');
};

