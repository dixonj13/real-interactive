import * as TestCase from './TestCase.js';
import Lexer from '../language/Lexer.js';
import Parser from '../language/Parser.js';
import Ast from '../language/Ast.js';

/** Tests the Parser class. */
export var ParserTest = function() {};

ParserTest.prototype = new TestCase.TestCase();

ParserTest.prototype.setUp = function() {
    this.lexer = new Lexer('σt1.number = 13(t1)');
    this.parser = new Parser(this.lexer);
};

ParserTest.prototype.it_is_a_Parser = function() {
    this.assertTrue(this.parser instanceof Parser);
};

ParserTest.prototype.it_can_consume_the_current_token_and_get_the_next_one = function() {
    this.assertStrictlyEqual('<SELECT, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<ID, t1>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<DOT, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<ID, number>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<EQL, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<NUMBER, 13>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<(, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<ID, t1>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertStrictlyEqual('<), null>', this.parser.lookahead.toString());
};

ParserTest.prototype.it_can_match_the_lookahead_token_to_a_token_type_which_consumes_the_current_token_if_they_match = function() {
    this.assertStrictlyEqual(this.lexer.types.SELECT, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.SELECT);
    this.assertStrictlyEqual(this.lexer.types.ID, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.ID);
    this.assertStrictlyEqual(this.lexer.types.DOT, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.DOT);
    this.assertStrictlyEqual(this.lexer.types.ID, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.ID);
    this.assertStrictlyEqual(this.lexer.types.EQL, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.EQL);
    this.assertStrictlyEqual(this.lexer.types.NUMBER, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.NUMBER);
    this.assertStrictlyEqual(this.lexer.types.LPAREN, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.LPAREN);
    this.assertStrictlyEqual(this.lexer.types.ID, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.ID);
    this.assertStrictlyEqual(this.lexer.types.RPAREN, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.RPAREN);
    this.assertStrictlyEqual(this.lexer.types.EOF, this.parser.lookahead.type);
    this.parser.match(this.lexer.types.EOF);
};

ParserTest.prototype.it_throws_an_error_and_does_not_consume_when_tokens_do_not_match = function() {
    this.assertStrictlyEqual(this.lexer.types.SELECT, this.parser.lookahead.type);
    this.expectError(function() { this.match(this.lexer.types.PROJECT); }.bind(this.parser),
        'Type mismatch; Expecting PROJECT but found SELECT');
    this.assertStrictlyEqual(this.lexer.types.SELECT, this.parser.lookahead.type);
};

ParserTest.prototype.it_can_parse_a_positive_number = function() {
    this.parser = new Parser(new Lexer('452'));
    var actual = this.parser.number();
    var expected = new Ast(this.lexer.types.NUMBER, '452');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_negative_nubmer = function() {
    this.parser = new Parser(new Lexer('-13'));
    var actual = this.parser.number();
    var expected = new Ast(this.lexer.types.MINUS);
    expected.addChild(new Ast(this.lexer.types.NUMBER, '13'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());     
};

ParserTest.prototype.it_can_parse_an_attribute_as_an_id = function() {
    this.parser = new Parser(new Lexer('table1'));
    var actual = this.parser.attribute();
    var expected = new Ast(this.lexer.types.ID, 'table1');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_an_attribute_as_a_fully_qualified_name = function() {
    this.parser = new Parser(new Lexer('table1.attribute1'));
    var actual = this.parser.attribute();
    var expected = new Ast(this.lexer.types.ATTR);
    expected.addChild(new Ast(this.lexer.types.ID, 'table1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'attribute1'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_list_of_comma_separated_attributes = function() {
    this.parser = new Parser(new Lexer('a1, t1.a2, t3.a4'));
    var actual = this.parser.attributes();
    var expected = new Ast(this.lexer.types.LIST);
    expected.addChild(new Ast(this.lexer.types.ID, 'a1'));
    var item2 = new Ast(this.lexer.types.ATTR);
    item2.addChild(new Ast(this.lexer.types.ID, 't1'));
    item2.addChild(new Ast(this.lexer.types.ID, 'a2'));
    expected.addChild(item2);
    var item3 = new Ast(this.lexer.types.ATTR);
    item3.addChild(new Ast(this.lexer.types.ID, 't3'));
    item3.addChild(new Ast(this.lexer.types.ID, 'a4'));
    expected.addChild(item3);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_string = function() {
    this.parser = new Parser(new Lexer('"123this_is_A_STr1ng!"'));
    var actual = this.parser.string();
    var expected = new Ast(this.lexer.types.STRING, '123this_is_A_STr1ng!');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_an_attribute_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('foo1'));
    var actual = this.parser.comparable();
    var expected = new Ast(this.lexer.types.ID, 'foo1');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_fully_qualified_attribute_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('foo1.bar2'));
    var actual = this.parser.comparable();
    var expected = new Ast(this.lexer.types.ATTR);
    expected.addChild(new Ast(this.lexer.types.ID, 'foo1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'bar2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_number_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('24612'));
    var actual = this.parser.comparable();
    var expected = new Ast(this.lexer.types.NUMBER, '24612');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_a_string_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('"#@!@str1ng_!#"'));
    var actual = this.parser.comparable();
    var expected = new Ast(this.lexer.types.STRING, '#@!@str1ng_!#');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_throws_an_error_when_a_comparable_value_is_not_an_attribute_or_string_or_number = function() {
    this.parser = new Parser(new Lexer('(val)'));
    this.expectError(function() { this.comparable(); }.bind(this.parser), 
        'Expected comparable value, but found <(, null>');
};

ParserTest.prototype.it_can_parse_less_than_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('<'));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.LESS);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_less_than_or_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('<=≤'));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.LEQ);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_greater_than_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('>'));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.GRTR);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_greater_than_or_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('>=≥'));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.GEQ);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('='));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.EQL);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_not_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('!=≠'));
    var actual = this.parser.compareOp();
    var expected = new Ast(this.lexer.types.NEQ);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    this.assertStrictlyEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_a_comparison = function() {
    this.parser = new Parser(new Lexer('t1.attr1 = "foo bar baz"'));
    var actual = this.parser.comparison();
    var expected = new Ast(this.lexer.types.EQL);
    var attribute = new Ast(this.lexer.types.ATTR);
    attribute.addChild(new Ast(this.lexer.types.ID, 't1'));
    attribute.addChild(new Ast(this.lexer.types.ID, 'attr1'));
    expected.addChild(attribute);
    expected.addChild(new Ast(this.lexer.types.STRING, 'foo bar baz'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_comparison_as_an_operand = function() {
    this.parser = new Parser(new Lexer('foo != 223'));
    var actual = this.parser.operand();
    var expected = new Ast(this.lexer.types.NEQ);
    expected.addChild(new Ast(this.lexer.types.ID, 'foo'));
    expected.addChild(new Ast(this.lexer.types.NUMBER, '223'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_an_operand_inside_of_parens = function() {
    this.parser = new Parser(new Lexer('(t2.bar >= t3.baz)'));
    var actual = this.parser.operand();
    var expected = new Ast(this.lexer.types.GEQ);
    var lhs = new Ast(this.lexer.types.ATTR);
    lhs.addChild(new Ast(this.lexer.types.ID, 't2'));
    lhs.addChild(new Ast(this.lexer.types.ID, 'bar'));
    var rhs = new Ast(this.lexer.types.ATTR);
    rhs.addChild(new Ast(this.lexer.types.ID, 't3'));
    rhs.addChild(new Ast(this.lexer.types.ID, 'baz'));
    expected.addChild(lhs);
    expected.addChild(rhs);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_negated_operand = function() {
    this.parser = new Parser(new Lexer('!(t2.bar >= t3.baz)'));
    var actual = this.parser.operand();
    var expected = new Ast(this.lexer.types.NOT);
    var geq = new Ast(this.lexer.types.GEQ);
    var lhs = new Ast(this.lexer.types.ATTR);
    lhs.addChild(new Ast(this.lexer.types.ID, 't2'));
    lhs.addChild(new Ast(this.lexer.types.ID, 'bar'));
    var rhs = new Ast(this.lexer.types.ATTR);
    rhs.addChild(new Ast(this.lexer.types.ID, 't3'));
    rhs.addChild(new Ast(this.lexer.types.ID, 'baz'));
    geq.addChild(lhs);
    geq.addChild(rhs);
    expected.addChild(geq);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_conjunction_of_operands = function() {
    this.parser = new Parser(new Lexer('a = 24 ∧ b > 15'));
    var actual = this.parser.conjunction();
    var expected = new Ast(this.lexer.types.AND);
    var operand1 = new Ast(this.lexer.types.EQL);
    operand1.addChild(new Ast(this.lexer.types.ID, 'a'));
    operand1.addChild(new Ast(this.lexer.types.NUMBER, '24'));
    var operand2 = new Ast(this.lexer.types.GRTR);
    operand2.addChild(new Ast(this.lexer.types.ID, 'b'));
    operand2.addChild(new Ast(this.lexer.types.NUMBER, '15'));
    expected.addChild(operand1);
    expected.addChild(operand2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_a_conjunction_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ b = 2 ∧ c = 3'));
    var actual = this.parser.conjunction();
    var expected = new Ast(this.lexer.types.AND);
    var child1 = new Ast(this.lexer.types.AND);
    var child1_operand1 = new Ast(this.lexer.types.EQL);
    child1_operand1.addChild(new Ast(this.lexer.types.ID, 'a'));
    child1_operand1.addChild(new Ast(this.lexer.types.NUMBER, '1'));
    var child1_operand2 = new Ast(this.lexer.types.EQL);
    child1_operand2.addChild(new Ast(this.lexer.types.ID, 'b'));
    child1_operand2.addChild(new Ast(this.lexer.types.NUMBER, '2'));
    child1.addChild(child1_operand1);
    child1.addChild(child1_operand2);
    var child2 = new Ast(this.lexer.types.EQL);
    child2.addChild(new Ast(this.lexer.types.ID, 'c'));
    child2.addChild(new Ast(this.lexer.types.NUMBER, '3'));
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_disjunction_of_conjunctions = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ b = 2 ∨ c = 3 ∧ d = 4'));
    var actual = this.parser.disjunction();
    var expected = new Ast(this.lexer.types.OR);
    var conjunction1 = new Ast(this.lexer.types.AND);
    var conjunction1_operand1 = new Ast(this.lexer.types.EQL);
    conjunction1_operand1.addChild(new Ast(this.lexer.types.ID, 'a'));
    conjunction1_operand1.addChild(new Ast(this.lexer.types.NUMBER, '1'));
    var conjunction1_operand2 = new Ast(this.lexer.types.EQL);
    conjunction1_operand2.addChild(new Ast(this.lexer.types.ID, 'b'));
    conjunction1_operand2.addChild(new Ast(this.lexer.types.NUMBER, '2'));
    conjunction1.addChild(conjunction1_operand1);
    conjunction1.addChild(conjunction1_operand2);
    var conjunction2 = new Ast(this.lexer.types.AND);
    var conjunction2_operand1 = new Ast(this.lexer.types.EQL);
    conjunction2_operand1.addChild(new Ast(this.lexer.types.ID, 'c'));
    conjunction2_operand1.addChild(new Ast(this.lexer.types.NUMBER, '3'));
    var conjunction2_operand2 = new Ast(this.lexer.types.EQL);
    conjunction2_operand2.addChild(new Ast(this.lexer.types.ID, 'd'));
    conjunction2_operand2.addChild(new Ast(this.lexer.types.NUMBER, '4'));
    conjunction2.addChild(conjunction2_operand1);
    conjunction2.addChild(conjunction2_operand2);
    expected.addChild(conjunction1);
    expected.addChild(conjunction2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_a_disjunction_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('a = 1 ∨ b = 2 ∨ c = 3'));
    var actual = this.parser.disjunction();
    var expected = new Ast(this.lexer.types.OR);
    var child1 = new Ast(this.lexer.types.OR);
    var child1_operand1 = new Ast(this.lexer.types.EQL);
    child1_operand1.addChild(new Ast(this.lexer.types.ID, 'a'));
    child1_operand1.addChild(new Ast(this.lexer.types.NUMBER, '1'));
    var child1_operand2 = new Ast(this.lexer.types.EQL);
    child1_operand2.addChild(new Ast(this.lexer.types.ID, 'b'));
    child1_operand2.addChild(new Ast(this.lexer.types.NUMBER, '2'));
    child1.addChild(child1_operand1);
    child1.addChild(child1_operand2);
    var child2 = new Ast(this.lexer.types.EQL);
    child2.addChild(new Ast(this.lexer.types.ID, 'c'));
    child2.addChild(new Ast(this.lexer.types.NUMBER, '3'));
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_precedence_of_predicate_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ (b = 2 ∨ c = 3)'));
    var actual = this.parser.disjunction();
    var expected = new Ast(this.lexer.types.AND);
    var child1 = new Ast(this.lexer.types.EQL);
    child1.addChild(new Ast(this.lexer.types.ID, 'a'));
    child1.addChild(new Ast(this.lexer.types.NUMBER, '1'));
    var child2 = new Ast(this.lexer.types.OR);
    var child2_operand1 = new Ast(this.lexer.types.EQL);
    child2_operand1.addChild(new Ast(this.lexer.types.ID, 'b'));
    child2_operand1.addChild(new Ast(this.lexer.types.NUMBER, '2'));
    var child2_operand2 = new Ast(this.lexer.types.EQL);
    child2_operand2.addChild(new Ast(this.lexer.types.ID, 'c'));
    child2_operand2.addChild(new Ast(this.lexer.types.NUMBER, '3'));
    child2.addChild(child2_operand1);
    child2.addChild(child2_operand2);
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_predicate_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('a = 1 ∨ (b = 2 ∨ c = 3)'));
    var actual = this.parser.disjunction();
    var expected = new Ast(this.lexer.types.OR);
    var child1 = new Ast(this.lexer.types.EQL);
    child1.addChild(new Ast(this.lexer.types.ID, 'a'));
    child1.addChild(new Ast(this.lexer.types.NUMBER, '1'));
    var child2 = new Ast(this.lexer.types.OR);
    var child2_operand1 = new Ast(this.lexer.types.EQL);
    child2_operand1.addChild(new Ast(this.lexer.types.ID, 'b'));
    child2_operand1.addChild(new Ast(this.lexer.types.NUMBER, '2'));
    var child2_operand2 = new Ast(this.lexer.types.EQL);
    child2_operand2.addChild(new Ast(this.lexer.types.ID, 'c'));
    child2_operand2.addChild(new Ast(this.lexer.types.NUMBER, '3'));
    child2.addChild(child2_operand1);
    child2.addChild(child2_operand2);
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_an_id_as_a_relation = function() {
    this.parser = new Parser(new Lexer('table1'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.ID, 'table1');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_parenthesized_relation = function() {
    this.parser = new Parser(new Lexer('(table2)'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.ID, 'table2');

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_project_statement_as_a_relation = function() {
    this.parser = new Parser(new Lexer('Π a1, t1.a2, a3 (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.PROJECT);
    var list = new Ast(this.lexer.types.LIST);
    list.addChild(new Ast(this.lexer.types.ID, 'a1'));
    var item2 = new Ast(this.lexer.types.ATTR);
    item2.addChild(new Ast(this.lexer.types.ID, 't1'));
    item2.addChild(new Ast(this.lexer.types.ID, 'a2'));
    list.addChild(item2);
    list.addChild(new Ast(this.lexer.types.ID, 'a3'));
    expected.addChild(list);
    expected.addChild(new Ast(this.lexer.types.ID, 't1'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_select_statement_as_a_relation = function() {
    this.parser = new Parser(new Lexer('σ a > 24 (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.SELECT);
    var predicate = new Ast(this.lexer.types.GRTR);
    predicate.addChild(new Ast(this.lexer.types.ID, 'a'));
    predicate.addChild(new Ast(this.lexer.types.NUMBER, '24'));
    expected.addChild(predicate);
    expected.addChild(new Ast(this.lexer.types.ID, 't1'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_rename_statement_with_no_attributes_as_a_relation = function() {
    this.parser = new Parser(new Lexer('ρ foo (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.RENAME);
    expected.addChild(new Ast(this.lexer.types.ID, 'foo'));
    expected.addChild(new Ast(this.lexer.types.ID, 't1'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_rename_statement_with_a_list_of_attributes_as_a_relation = function() {
    this.parser = new Parser(new Lexer('ρ bar [b1, b2, b3] (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(this.lexer.types.RENAME);
    expected.addChild(new Ast(this.lexer.types.ID, 'bar'));
    var list = new Ast(this.lexer.types.LIST);
    list.addChild(new Ast(this.lexer.types.ID, 'b1'));
    list.addChild(new Ast(this.lexer.types.ID, 'b2'));
    list.addChild(new Ast(this.lexer.types.ID, 'b3'));
    expected.addChild(list);
    expected.addChild(new Ast(this.lexer.types.ID, 't1'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_throws_an_error_when_a_rename_statement_has_an_empty_attributes_list = function() {
    this.parser = new Parser(new Lexer('ρ bar [] (t1)'));
    this.expectError(function() { this.relation(); }.bind(this.parser), 
        `Type mismatch; Expecting ID but found ]`);
};

ParserTest.prototype.it_throws_an_error_when_a_relation_is_not_of_a_valid_type = function() {
    this.parser = new Parser(new Lexer('∪'));
    this.expectError(function() { this.relation(); }.bind(this.parser),
        `Expected start of relation but found UNION`);
};

ParserTest.prototype.it_can_parse_a_cartesian_product = function() {
    this.parser = new Parser(new Lexer('r1 × r2'));
    var actual = this.parser.cartesianProduct();
    var expected = new Ast(this.lexer.types.CPROD);
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_cartesian_product_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 × r2 × r3'));
    var actual = this.parser.cartesianProduct();
    var expected = new Ast(this.lexer.types.CPROD);
    var child = new Ast(this.lexer.types.CPROD);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_cartesian_product_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 × (r2 × r3)'));
    var actual = this.parser.cartesianProduct();
    var expected = new Ast(this.lexer.types.CPROD);
    var child = new Ast(this.lexer.types.CPROD);
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    child.addChild(new Ast(this.lexer.types.ID, 'r3'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(child);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_join = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ r2')); // join symbol
    var actual = this.parser.join();
    var expected = new Ast(this.lexer.types.NJOIN);
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_join_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ r2 ⨝ r3'));
    var actual = this.parser.join();
    var expected = new Ast(this.lexer.types.NJOIN);
    var child = new Ast(this.lexer.types.NJOIN);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_join_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ (r2 ⨝ r3)'));
    var actual = this.parser.join();
    var expected = new Ast(this.lexer.types.NJOIN);
    var child = new Ast(this.lexer.types.NJOIN);
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    child.addChild(new Ast(this.lexer.types.ID, 'r3'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(child);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_difference = function() {
    this.parser = new Parser(new Lexer('r1 − r2')); 
    var actual = this.parser.difference();
    var expected = new Ast(this.lexer.types.DIFF);
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_difference_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 − r2 − r3'));
    var actual = this.parser.difference();
    var expected = new Ast(this.lexer.types.DIFF);
    var child = new Ast(this.lexer.types.DIFF);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_difference_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 − (r2 − r3)'));
    var actual = this.parser.difference();
    var expected = new Ast(this.lexer.types.DIFF);
    var child = new Ast(this.lexer.types.DIFF);
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    child.addChild(new Ast(this.lexer.types.ID, 'r3'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(child);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_union = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2')); 
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.UNION);
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_union_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∪ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.UNION);
    var child = new Ast(this.lexer.types.UNION);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_union_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ∪ (r2 ∪ r3)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.UNION);
    var child = new Ast(this.lexer.types.UNION);
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    child.addChild(new Ast(this.lexer.types.ID, 'r3'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(child);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_intersection = function() {
    this.parser = new Parser(new Lexer('r1 ∩ r2')); 
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.ISECT);
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r2'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_intersection_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ∩ r2 ∩ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.ISECT);
    var child = new Ast(this.lexer.types.ISECT);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_intersection_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ∩ (r2 ∩ r3)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.ISECT);
    var child = new Ast(this.lexer.types.ISECT);
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    child.addChild(new Ast(this.lexer.types.ID, 'r3'));
    expected.addChild(new Ast(this.lexer.types.ID, 'r1'));
    expected.addChild(child);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_union_and_intersection_with_the_same_precedence = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∩ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.ISECT);
    var child = new Ast(this.lexer.types.UNION);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());

    this.parser = new Parser(new Lexer('r1 ∩ r2 ∪ r3'));
    actual = this.parser.unionIntersection();
    expected = new Ast(this.lexer.types.UNION);
    child = new Ast(this.lexer.types.ISECT);
    child.addChild(new Ast(this.lexer.types.ID, 'r1'));
    child.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(this.lexer.types.ID, 'r3'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_maintains_precedence_of_relation_set_operations = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∩ r3 − r4 ⨝ r5 × r6'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.ISECT);
    var union = new Ast(this.lexer.types.UNION);
    union.addChild(new Ast(this.lexer.types.ID, 'r1'));
    union.addChild(new Ast(this.lexer.types.ID, 'r2'));
    expected.addChild(union);
    var cprod = new Ast(this.lexer.types.CPROD);
    cprod.addChild(new Ast(this.lexer.types.ID, 'r5'));
    cprod.addChild(new Ast(this.lexer.types.ID, 'r6'));
    var njoin = new Ast(this.lexer.types.NJOIN);
    njoin.addChild(new Ast(this.lexer.types.ID, 'r4'));
    njoin.addChild(cprod);
    var diff = new Ast(this.lexer.types.DIFF);
    diff.addChild(new Ast(this.lexer.types.ID, 'r3'));
    diff.addChild(njoin);
    expected.addChild(diff);

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());

    this.parser = new Parser(new Lexer('r1 × r2 ⨝ r3 − r4 ∪ r5 ∩ r6'));
    actual = this.parser.unionIntersection();
    expected = new Ast(this.lexer.types.ISECT);
    cprod = new Ast(this.lexer.types.CPROD);
    cprod.addChild(new Ast(this.lexer.types.ID, 'r1'));
    cprod.addChild(new Ast(this.lexer.types.ID, 'r2'));
    njoin = new Ast(this.lexer.types.NJOIN);
    njoin.addChild(cprod);
    njoin.addChild(new Ast(this.lexer.types.ID, 'r3'));
    diff = new Ast(this.lexer.types.DIFF);
    diff.addChild(njoin);
    diff.addChild(new Ast(this.lexer.types.ID, 'r4'));
    union = new Ast(this.lexer.types.UNION);
    union.addChild(diff);
    union.addChild(new Ast(this.lexer.types.ID, 'r5'));
    expected.addChild(union);
    expected.addChild(new Ast(this.lexer.types.ID, 'r6'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_precedence_of_set_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('(((((r1 ∪ r2) ∩ r3) − r4) ⨝ r5) × r6)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(this.lexer.types.CPROD);
    var union = new Ast(this.lexer.types.UNION);
    union.addChild(new Ast(this.lexer.types.ID, 'r1'));
    union.addChild(new Ast(this.lexer.types.ID, 'r2'));
    var isect = new Ast(this.lexer.types.ISECT);
    isect.addChild(union);
    isect.addChild(new Ast(this.lexer.types.ID, 'r3'));
    var diff = new Ast(this.lexer.types.DIFF);
    diff.addChild(isect);
    diff.addChild(new Ast(this.lexer.types.ID, 'r4'));
    var njoin = new Ast(this.lexer.types.NJOIN);
    njoin.addChild(diff);
    njoin.addChild(new Ast(this.lexer.types.ID, 'r5'));
    expected.addChild(njoin);
    expected.addChild(new Ast(this.lexer.types.ID, 'r6'));

    this.assertStrictlyEqual(expected.toTreeString(), actual.toTreeString());
    console.log(actual.toTreeString());
};












