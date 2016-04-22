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
    this.assertEqual('foo', this.lexer.text);
};

LexerTest.prototype.it_has_a_position_within_the_text_start_at_0 = function() {
    this.assertEqual(0, this.lexer.pos);
};

LexerTest.prototype.it_has_a_character_starting_at_the_first_character_in_the_text = function() {
    this.assertEqual('f', this.lexer.char);
};

LexerTest.prototype.it_has_a_finite_list_of_available_token_types = function() {
    this.assertEqual('EOF', tokenTypes.EOF);
    this.assertEqual('RELATION', tokenTypes.RELATION);
    this.assertEqual('ID', tokenTypes.ID);
    this.assertEqual('NUMBER', tokenTypes.NUMBER);
    this.assertEqual('STRING', tokenTypes.STRING);
    this.assertEqual('ATTR', tokenTypes.ATTR);
    this.assertEqual('LIST', tokenTypes.LIST);
    this.assertEqual('(', tokenTypes.LPAREN);
    this.assertEqual(')', tokenTypes.RPAREN);
    this.assertEqual('[', tokenTypes.LBRACK);
    this.assertEqual(']', tokenTypes.RBRACK);
    this.assertEqual('DOT', tokenTypes.DOT);
    this.assertEqual('COMMA', tokenTypes.COMMA);
    this.assertEqual('NJOIN', tokenTypes.NJOIN);
    this.assertEqual('SELECT', tokenTypes.SELECT);
    this.assertEqual('PROJECT', tokenTypes.PROJECT);
    this.assertEqual('RENAME', tokenTypes.RENAME);
    this.assertEqual('UNION', tokenTypes.UNION);
    this.assertEqual('ISECT', tokenTypes.ISECT);
    this.assertEqual('DIFF', tokenTypes.DIFF);
    this.assertEqual('CPROD', tokenTypes.CPROD);
    this.assertEqual('AND', tokenTypes.AND);
    this.assertEqual('OR', tokenTypes.OR);
    this.assertEqual('NOT', tokenTypes.NOT);
    this.assertEqual('MINUS', tokenTypes.MINUS);
    this.assertEqual('GRTR', tokenTypes.GRTR);
    this.assertEqual('GEQ', tokenTypes.GEQ);
    this.assertEqual('EQL', tokenTypes.EQL);
    this.assertEqual('NEQ', tokenTypes.NEQ);
    this.assertEqual('LESS', tokenTypes.LESS);
    this.assertEqual('LEQ', tokenTypes.LEQ);
};

LexerTest.prototype.it_can_consume_incrementing_the_position_and_getting_the_next_character = function() {
    this.assertEqual(0, this.lexer.pos);
    this.assertEqual('f', this.lexer.char);
    this.lexer.consume();
    this.assertEqual(1, this.lexer.pos);
    this.assertEqual('o', this.lexer.char);
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
    this.assertEqual('<EOF, null>', token.toString());
};

LexerTest.prototype.it_can_eat_the_white_space_between_characters = function() {
    this.lexer = new Lexer('a   b \t c \n d \r e');

    this.lexer.consume();
    this.assertEqual(' ', this.lexer.char);
    this.assertEqual(1, this.lexer.pos);

    this.lexer.whitespace();
    this.assertEqual('b', this.lexer.char);
    this.assertEqual(4, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertEqual('c', this.lexer.char);
    this.assertEqual(8, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertEqual('d', this.lexer.char);
    this.assertEqual(12, this.lexer.pos);

    this.lexer.consume();
    this.lexer.whitespace();
    this.assertEqual('e', this.lexer.char);
    this.assertEqual(16, this.lexer.pos);
};

LexerTest.prototype.it_can_parse_a_ID_of_alpha_numeric_chars_and_underscores_not_starting_with_a_digit = function() {
    this.lexer = new Lexer('foo._bAR12(B__A_Z_\tQ_1_u_2_X_3;n0rF___');

    var token = this.lexer.nextToken();
    this.assertEqual('<ID, foo>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<ID, _bAR12>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<ID, B__A_Z_>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<ID, Q_1_u_2_X_3>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<ID, n0rF___>', token.toString());
    this.lexer.consume();
};

LexerTest.prototype.it_can_parse_a_NUMBER_made_of_digits_not_starting_with_0 = function() {
    this.lexer = new Lexer('12a3456\r789!987654321012345');

    var token = this.lexer.nextToken();
    this.assertEqual('<NUMBER, 12>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<NUMBER, 3456>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<NUMBER, 789>', token.toString());
    this.lexer.consume();

    token = this.lexer.nextToken();
    this.assertEqual('<NUMBER, 987654321012345>', token.toString());
};

LexerTest.prototype.it_can_parse_a_string_between_two_double_quotes = function() {
    this.lexer = new Lexer('"`~!@#$%^&*()[]{}<>/,._-+=| 123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"');

    var token = this.lexer.nextToken();
    this.assertEqual('<STRING, `~!@#$%^&*()[]{}<>/,._-+=| 123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ>',
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
    this.assertEqual('<(, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<), null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<[, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<], null>', token.toString());
};

LexerTest.prototype.it_can_parse_commas_and_periods_as_tokens = function() {
    this.lexer = new Lexer('.,.,');

    var token = this.lexer.nextToken();
    this.assertEqual('<DOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<COMMA, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<DOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<COMMA, null>', token.toString());
};

LexerTest.prototype.it_can_parse_set_operators_as_tokens = function() {
    this.lexer = new Lexer('⨝σΠπρ∪∩−×∧∨¬-!!=>>=≥=≠<<=≤');

    var token = this.lexer.nextToken();
    this.assertEqual('<NJOIN, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<SELECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<PROJECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<PROJECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<RENAME, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<UNION, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<ISECT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<DIFF, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<CPROD, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<AND, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<OR, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<NOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<MINUS, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<NOT, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<NEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<GRTR, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<GEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<GEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<EQL, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<NEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<LESS, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<LEQ, null>', token.toString());

    token = this.lexer.nextToken();
    this.assertEqual('<LEQ, null>', token.toString());
};

LexerTest.prototype.it_throws_an_error_for_tokens_starting_with_a_zero = function() {
    this.lexer = new Lexer('0a123');
    this.expectError(function() { this.nextToken(); }.bind(this.lexer),
        'Invalid character: 0 at position 0');
};

LexerTest.prototype.it_errors = function() {
    this.lexer = new Lexer('%');
};

