import { TestCase } from './TestCase';
import Lexer from '../language/Lexer';
import Parser from '../language/Parser';
import Ast from '../language/Ast';
import { tokenTypes } from '../language/TokenTypes';

/** Tests the Parser class. */
export var ParserTest = function() {};

ParserTest.prototype = new TestCase();

ParserTest.prototype.setUp = function() {
    this.lexer = new Lexer('σt1.number = 13(t1)');
    this.parser = new Parser(this.lexer);
};

ParserTest.prototype.it_is_a_Parser = function() {
    this.assertTrue(this.parser instanceof Parser);
};

ParserTest.prototype.it_can_consume_the_current_token_and_get_the_next_one = function() {
    this.assertEqual('<SELECT, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<ID, t1>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<DOT, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<ID, number>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<EQL, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<NUMBER, 13>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<(, null>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<ID, t1>', this.parser.lookahead.toString());
    this.parser.consume();
    this.assertEqual('<), null>', this.parser.lookahead.toString());
};

ParserTest.prototype.it_can_match_the_lookahead_token_to_a_token_type_which_consumes_the_current_token_if_they_match = function() {
    this.assertEqual(tokenTypes.SELECT, this.parser.lookahead.type);
    this.parser.match(tokenTypes.SELECT);
    this.assertEqual(tokenTypes.ID, this.parser.lookahead.type);
    this.parser.match(tokenTypes.ID);
    this.assertEqual(tokenTypes.DOT, this.parser.lookahead.type);
    this.parser.match(tokenTypes.DOT);
    this.assertEqual(tokenTypes.ID, this.parser.lookahead.type);
    this.parser.match(tokenTypes.ID);
    this.assertEqual(tokenTypes.EQL, this.parser.lookahead.type);
    this.parser.match(tokenTypes.EQL);
    this.assertEqual(tokenTypes.NUMBER, this.parser.lookahead.type);
    this.parser.match(tokenTypes.NUMBER);
    this.assertEqual(tokenTypes.LPAREN, this.parser.lookahead.type);
    this.parser.match(tokenTypes.LPAREN);
    this.assertEqual(tokenTypes.ID, this.parser.lookahead.type);
    this.parser.match(tokenTypes.ID);
    this.assertEqual(tokenTypes.RPAREN, this.parser.lookahead.type);
    this.parser.match(tokenTypes.RPAREN);
    this.assertEqual(tokenTypes.EOF, this.parser.lookahead.type);
    this.parser.match(tokenTypes.EOF);
};

ParserTest.prototype.it_throws_an_error_and_does_not_consume_when_tokens_do_not_match = function() {
    this.assertEqual(tokenTypes.SELECT, this.parser.lookahead.type);
    this.expectError(function() { this.match(tokenTypes.PROJECT); }.bind(this.parser),
        'Type mismatch; Expecting PROJECT but found SELECT');
    this.assertEqual(tokenTypes.SELECT, this.parser.lookahead.type);
};

ParserTest.prototype.it_can_parse_a_positive_number = function() {
    this.parser = new Parser(new Lexer('452'));
    var actual = this.parser.number();
    var expected = new Ast(tokenTypes.NUMBER, '452');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_negative_number = function() {
    this.parser = new Parser(new Lexer('-13'));
    var actual = this.parser.number();
    var expected = new Ast(tokenTypes.MINUS);
    expected.addChild(new Ast(tokenTypes.NUMBER, '13'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());     
};

ParserTest.prototype.it_can_parse_an_attribute_as_an_id = function() {
    this.parser = new Parser(new Lexer('table1'));
    var actual = this.parser.attribute();
    var expected = new Ast(tokenTypes.ID, 'table1');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_an_attribute_as_a_fully_qualified_name = function() {
    this.parser = new Parser(new Lexer('table1.attribute1'));
    var actual = this.parser.attribute();
    var expected = new Ast(tokenTypes.ATTR);
    expected.addChild(new Ast(tokenTypes.ID, 'table1'));
    expected.addChild(new Ast(tokenTypes.ID, 'attribute1'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_list_of_comma_separated_attributes = function() {
    this.parser = new Parser(new Lexer('a1, t1.a2, t3.a4'));
    var actual = this.parser.attributes();
    var expected = new Ast(tokenTypes.LIST);
    expected.addChild(new Ast(tokenTypes.ID, 'a1'));
    var item2 = new Ast(tokenTypes.ATTR);
    item2.addChild(new Ast(tokenTypes.ID, 't1'));
    item2.addChild(new Ast(tokenTypes.ID, 'a2'));
    expected.addChild(item2);
    var item3 = new Ast(tokenTypes.ATTR);
    item3.addChild(new Ast(tokenTypes.ID, 't3'));
    item3.addChild(new Ast(tokenTypes.ID, 'a4'));
    expected.addChild(item3);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_string = function() {
    this.parser = new Parser(new Lexer('"123this_is_A_STr1ng!"'));
    var actual = this.parser.string();
    var expected = new Ast(tokenTypes.STRING, '123this_is_A_STr1ng!');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_an_attribute_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('foo1'));
    var actual = this.parser.comparable();
    var expected = new Ast(tokenTypes.ID, 'foo1');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_fully_qualified_attribute_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('foo1.bar2'));
    var actual = this.parser.comparable();
    var expected = new Ast(tokenTypes.ATTR);
    expected.addChild(new Ast(tokenTypes.ID, 'foo1'));
    expected.addChild(new Ast(tokenTypes.ID, 'bar2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_number_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('24612'));
    var actual = this.parser.comparable();
    var expected = new Ast(tokenTypes.NUMBER, '24612');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_a_negative_number_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('-1442'));
    var actual = this.parser.comparable();
    var expected = new Ast(tokenTypes.MINUS);
    expected.addChild(new Ast(tokenTypes.NUMBER, '1442'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_string_as_a_comparable_value = function() {
    this.parser = new Parser(new Lexer('"#@!@str1ng_!#"'));
    var actual = this.parser.comparable();
    var expected = new Ast(tokenTypes.STRING, '#@!@str1ng_!#');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_throws_an_error_when_a_comparable_value_is_not_an_attribute_or_string_or_number = function() {
    this.parser = new Parser(new Lexer('(val)'));
    this.expectError(function() { this.comparable(); }.bind(this.parser), 
        'Expected comparable value, but found <(, null>');
};

ParserTest.prototype.it_can_parse_less_than_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('<'));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.LESS);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_less_than_or_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('<=≤'));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.LEQ);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_greater_than_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('>'));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.GRTR);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_greater_than_or_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('>=≥'));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.GEQ);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('='));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.EQL);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_not_equal_to_as_a_comparison_operator = function() {
    this.parser = new Parser(new Lexer('!=≠'));
    var actual = this.parser.compareOp();
    var expected = new Ast(tokenTypes.NEQ);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());

    actual = this.parser.compareOp();

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
    this.assertEqual(expected.toString(), actual.toString());
};

ParserTest.prototype.it_can_parse_a_comparison = function() {
    this.parser = new Parser(new Lexer('t1.attr1 = "foo bar baz"'));
    var actual = this.parser.comparison();
    var expected = new Ast(tokenTypes.EQL);
    var attribute = new Ast(tokenTypes.ATTR);
    attribute.addChild(new Ast(tokenTypes.ID, 't1'));
    attribute.addChild(new Ast(tokenTypes.ID, 'attr1'));
    expected.addChild(attribute);
    expected.addChild(new Ast(tokenTypes.STRING, 'foo bar baz'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_comparison_as_an_operand = function() {
    this.parser = new Parser(new Lexer('foo != 223'));
    var actual = this.parser.operand();
    var expected = new Ast(tokenTypes.NEQ);
    expected.addChild(new Ast(tokenTypes.ID, 'foo'));
    expected.addChild(new Ast(tokenTypes.NUMBER, '223'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_an_operand_inside_of_parens = function() {
    this.parser = new Parser(new Lexer('(t2.bar >= t3.baz)'));
    var actual = this.parser.operand();
    var expected = new Ast(tokenTypes.GEQ);
    var lhs = new Ast(tokenTypes.ATTR);
    lhs.addChild(new Ast(tokenTypes.ID, 't2'));
    lhs.addChild(new Ast(tokenTypes.ID, 'bar'));
    var rhs = new Ast(tokenTypes.ATTR);
    rhs.addChild(new Ast(tokenTypes.ID, 't3'));
    rhs.addChild(new Ast(tokenTypes.ID, 'baz'));
    expected.addChild(lhs);
    expected.addChild(rhs);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_negated_operand = function() {
    this.parser = new Parser(new Lexer('!(t2.bar >= t3.baz)'));
    var actual = this.parser.operand();
    var expected = new Ast(tokenTypes.NOT);
    var geq = new Ast(tokenTypes.GEQ);
    var lhs = new Ast(tokenTypes.ATTR);
    lhs.addChild(new Ast(tokenTypes.ID, 't2'));
    lhs.addChild(new Ast(tokenTypes.ID, 'bar'));
    var rhs = new Ast(tokenTypes.ATTR);
    rhs.addChild(new Ast(tokenTypes.ID, 't3'));
    rhs.addChild(new Ast(tokenTypes.ID, 'baz'));
    geq.addChild(lhs);
    geq.addChild(rhs);
    expected.addChild(geq);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_conjunction_of_operands = function() {
    this.parser = new Parser(new Lexer('a = 24 ∧ b > 15'));
    var actual = this.parser.conjunction();
    var expected = new Ast(tokenTypes.AND);
    var operand1 = new Ast(tokenTypes.EQL);
    operand1.addChild(new Ast(tokenTypes.ID, 'a'));
    operand1.addChild(new Ast(tokenTypes.NUMBER, '24'));
    var operand2 = new Ast(tokenTypes.GRTR);
    operand2.addChild(new Ast(tokenTypes.ID, 'b'));
    operand2.addChild(new Ast(tokenTypes.NUMBER, '15'));
    expected.addChild(operand1);
    expected.addChild(operand2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_a_conjunction_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ b = 2 ∧ c = 3'));
    var actual = this.parser.conjunction();
    var expected = new Ast(tokenTypes.AND);
    var child1 = new Ast(tokenTypes.AND);
    var child1_operand1 = new Ast(tokenTypes.EQL);
    child1_operand1.addChild(new Ast(tokenTypes.ID, 'a'));
    child1_operand1.addChild(new Ast(tokenTypes.NUMBER, '1'));
    var child1_operand2 = new Ast(tokenTypes.EQL);
    child1_operand2.addChild(new Ast(tokenTypes.ID, 'b'));
    child1_operand2.addChild(new Ast(tokenTypes.NUMBER, '2'));
    child1.addChild(child1_operand1);
    child1.addChild(child1_operand2);
    var child2 = new Ast(tokenTypes.EQL);
    child2.addChild(new Ast(tokenTypes.ID, 'c'));
    child2.addChild(new Ast(tokenTypes.NUMBER, '3'));
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_disjunction_of_conjunctions = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ b = 2 ∨ c = 3 ∧ d = 4'));
    var actual = this.parser.disjunction();
    var expected = new Ast(tokenTypes.OR);
    var conjunction1 = new Ast(tokenTypes.AND);
    var conjunction1_operand1 = new Ast(tokenTypes.EQL);
    conjunction1_operand1.addChild(new Ast(tokenTypes.ID, 'a'));
    conjunction1_operand1.addChild(new Ast(tokenTypes.NUMBER, '1'));
    var conjunction1_operand2 = new Ast(tokenTypes.EQL);
    conjunction1_operand2.addChild(new Ast(tokenTypes.ID, 'b'));
    conjunction1_operand2.addChild(new Ast(tokenTypes.NUMBER, '2'));
    conjunction1.addChild(conjunction1_operand1);
    conjunction1.addChild(conjunction1_operand2);
    var conjunction2 = new Ast(tokenTypes.AND);
    var conjunction2_operand1 = new Ast(tokenTypes.EQL);
    conjunction2_operand1.addChild(new Ast(tokenTypes.ID, 'c'));
    conjunction2_operand1.addChild(new Ast(tokenTypes.NUMBER, '3'));
    var conjunction2_operand2 = new Ast(tokenTypes.EQL);
    conjunction2_operand2.addChild(new Ast(tokenTypes.ID, 'd'));
    conjunction2_operand2.addChild(new Ast(tokenTypes.NUMBER, '4'));
    conjunction2.addChild(conjunction2_operand1);
    conjunction2.addChild(conjunction2_operand2);
    expected.addChild(conjunction1);
    expected.addChild(conjunction2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_a_disjunction_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('a = 1 ∨ b = 2 ∨ c = 3'));
    var actual = this.parser.disjunction();
    var expected = new Ast(tokenTypes.OR);
    var child1 = new Ast(tokenTypes.OR);
    var child1_operand1 = new Ast(tokenTypes.EQL);
    child1_operand1.addChild(new Ast(tokenTypes.ID, 'a'));
    child1_operand1.addChild(new Ast(tokenTypes.NUMBER, '1'));
    var child1_operand2 = new Ast(tokenTypes.EQL);
    child1_operand2.addChild(new Ast(tokenTypes.ID, 'b'));
    child1_operand2.addChild(new Ast(tokenTypes.NUMBER, '2'));
    child1.addChild(child1_operand1);
    child1.addChild(child1_operand2);
    var child2 = new Ast(tokenTypes.EQL);
    child2.addChild(new Ast(tokenTypes.ID, 'c'));
    child2.addChild(new Ast(tokenTypes.NUMBER, '3'));
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_precedence_of_predicate_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('a = 1 ∧ (b = 2 ∨ c = 3)'));
    var actual = this.parser.disjunction();
    var expected = new Ast(tokenTypes.AND);
    var child1 = new Ast(tokenTypes.EQL);
    child1.addChild(new Ast(tokenTypes.ID, 'a'));
    child1.addChild(new Ast(tokenTypes.NUMBER, '1'));
    var child2 = new Ast(tokenTypes.OR);
    var child2_operand1 = new Ast(tokenTypes.EQL);
    child2_operand1.addChild(new Ast(tokenTypes.ID, 'b'));
    child2_operand1.addChild(new Ast(tokenTypes.NUMBER, '2'));
    var child2_operand2 = new Ast(tokenTypes.EQL);
    child2_operand2.addChild(new Ast(tokenTypes.ID, 'c'));
    child2_operand2.addChild(new Ast(tokenTypes.NUMBER, '3'));
    child2.addChild(child2_operand1);
    child2.addChild(child2_operand2);
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_predicate_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('a = 1 ∨ (b = 2 ∨ c = 3)'));
    var actual = this.parser.disjunction();
    var expected = new Ast(tokenTypes.OR);
    var child1 = new Ast(tokenTypes.EQL);
    child1.addChild(new Ast(tokenTypes.ID, 'a'));
    child1.addChild(new Ast(tokenTypes.NUMBER, '1'));
    var child2 = new Ast(tokenTypes.OR);
    var child2_operand1 = new Ast(tokenTypes.EQL);
    child2_operand1.addChild(new Ast(tokenTypes.ID, 'b'));
    child2_operand1.addChild(new Ast(tokenTypes.NUMBER, '2'));
    var child2_operand2 = new Ast(tokenTypes.EQL);
    child2_operand2.addChild(new Ast(tokenTypes.ID, 'c'));
    child2_operand2.addChild(new Ast(tokenTypes.NUMBER, '3'));
    child2.addChild(child2_operand1);
    child2.addChild(child2_operand2);
    expected.addChild(child1);
    expected.addChild(child2);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_an_id_as_a_relation = function() {
    this.parser = new Parser(new Lexer('table1'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.RELATION, 'table1');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_parenthesized_relation = function() {
    this.parser = new Parser(new Lexer('(table2)'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.RELATION, 'table2');

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_project_statement_as_a_relation = function() {
    this.parser = new Parser(new Lexer('Π a1, t1.a2, a3 (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.PROJECT);
    var list = new Ast(tokenTypes.LIST);
    list.addChild(new Ast(tokenTypes.ID, 'a1'));
    var item2 = new Ast(tokenTypes.ATTR);
    item2.addChild(new Ast(tokenTypes.ID, 't1'));
    item2.addChild(new Ast(tokenTypes.ID, 'a2'));
    list.addChild(item2);
    list.addChild(new Ast(tokenTypes.ID, 'a3'));
    expected.addChild(list);
    expected.addChild(new Ast(tokenTypes.RELATION, 't1'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_select_statement_as_a_relation = function() {
    this.parser = new Parser(new Lexer('σ a > 24 (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.SELECT);
    var predicate = new Ast(tokenTypes.GRTR);
    predicate.addChild(new Ast(tokenTypes.ID, 'a'));
    predicate.addChild(new Ast(tokenTypes.NUMBER, '24'));
    expected.addChild(predicate);
    expected.addChild(new Ast(tokenTypes.RELATION, 't1'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_rename_statement_with_no_attributes_as_a_relation = function() {
    this.parser = new Parser(new Lexer('ρ foo (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.RENAME);
    expected.addChild(new Ast(tokenTypes.ID, 'foo'));
    expected.addChild(new Ast(tokenTypes.RELATION, 't1'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_rename_statement_with_a_list_of_attributes_as_a_relation = function() {
    this.parser = new Parser(new Lexer('ρ bar [b1, b2, b3] (t1)'));
    var actual = this.parser.relation();
    var expected = new Ast(tokenTypes.RENAME);
    expected.addChild(new Ast(tokenTypes.ID, 'bar'));
    var list = new Ast(tokenTypes.LIST);
    list.addChild(new Ast(tokenTypes.ID, 'b1'));
    list.addChild(new Ast(tokenTypes.ID, 'b2'));
    list.addChild(new Ast(tokenTypes.ID, 'b3'));
    expected.addChild(list);
    expected.addChild(new Ast(tokenTypes.RELATION, 't1'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
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
    var expected = new Ast(tokenTypes.CPROD);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_cartesian_product_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 × r2 × r3'));
    var actual = this.parser.cartesianProduct();
    var expected = new Ast(tokenTypes.CPROD);
    var child = new Ast(tokenTypes.CPROD);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_cartesian_product_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 × (r2 × r3)'));
    var actual = this.parser.cartesianProduct();
    var expected = new Ast(tokenTypes.CPROD);
    var child = new Ast(tokenTypes.CPROD);
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(child);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_a_join = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ r2')); // join symbol
    var actual = this.parser.join();
    var expected = new Ast(tokenTypes.NJOIN);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_join_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ r2 ⨝ r3'));
    var actual = this.parser.join();
    var expected = new Ast(tokenTypes.NJOIN);
    var child = new Ast(tokenTypes.NJOIN);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_join_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ⨝ (r2 ⨝ r3)'));
    var actual = this.parser.join();
    var expected = new Ast(tokenTypes.NJOIN);
    var child = new Ast(tokenTypes.NJOIN);
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(child);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_difference = function() {
    this.parser = new Parser(new Lexer('r1 − r2')); 
    var actual = this.parser.difference();
    var expected = new Ast(tokenTypes.DIFF);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_difference_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 − r2 − r3'));
    var actual = this.parser.difference();
    var expected = new Ast(tokenTypes.DIFF);
    var child = new Ast(tokenTypes.DIFF);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_difference_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 − (r2 − r3)'));
    var actual = this.parser.difference();
    var expected = new Ast(tokenTypes.DIFF);
    var child = new Ast(tokenTypes.DIFF);
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(child);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_union = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2')); 
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.UNION);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_union_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∪ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.UNION);
    var child = new Ast(tokenTypes.UNION);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_union_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ∪ (r2 ∪ r3)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.UNION);
    var child = new Ast(tokenTypes.UNION);
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(child);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_parse_intersection = function() {
    this.parser = new Parser(new Lexer('r1 ∩ r2')); 
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.ISECT);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r2'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_intersection_with_left_associativity = function() {
    this.parser = new Parser(new Lexer('r1 ∩ r2 ∩ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.ISECT);
    var child = new Ast(tokenTypes.ISECT);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_associativity_of_intersection_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('r1 ∩ (r2 ∩ r3)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.ISECT);
    var child = new Ast(tokenTypes.ISECT);
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    expected.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    expected.addChild(child);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_parses_union_and_intersection_with_the_same_precedence = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∩ r3'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.ISECT);
    var child = new Ast(tokenTypes.UNION);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());

    this.parser = new Parser(new Lexer('r1 ∩ r2 ∪ r3'));
    actual = this.parser.unionIntersection();
    expected = new Ast(tokenTypes.UNION);
    child = new Ast(tokenTypes.ISECT);
    child.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    child.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(child);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r3'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_maintains_precedence_of_relation_set_operations = function() {
    this.parser = new Parser(new Lexer('r1 ∪ r2 ∩ r3 − r4 ⨝ r5 × r6'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.ISECT);
    var union = new Ast(tokenTypes.UNION);
    union.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    union.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    expected.addChild(union);
    var cprod = new Ast(tokenTypes.CPROD);
    cprod.addChild(new Ast(tokenTypes.RELATION, 'r5'));
    cprod.addChild(new Ast(tokenTypes.RELATION, 'r6'));
    var njoin = new Ast(tokenTypes.NJOIN);
    njoin.addChild(new Ast(tokenTypes.RELATION, 'r4'));
    njoin.addChild(cprod);
    var diff = new Ast(tokenTypes.DIFF);
    diff.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    diff.addChild(njoin);
    expected.addChild(diff);

    this.assertEqual(expected.toTreeString(), actual.toTreeString());

    this.parser = new Parser(new Lexer('r1 × r2 ⨝ r3 − r4 ∪ r5 ∩ r6'));
    actual = this.parser.unionIntersection();
    expected = new Ast(tokenTypes.ISECT);
    cprod = new Ast(tokenTypes.CPROD);
    cprod.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    cprod.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    njoin = new Ast(tokenTypes.NJOIN);
    njoin.addChild(cprod);
    njoin.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    diff = new Ast(tokenTypes.DIFF);
    diff.addChild(njoin);
    diff.addChild(new Ast(tokenTypes.RELATION, 'r4'));
    union = new Ast(tokenTypes.UNION);
    union.addChild(diff);
    union.addChild(new Ast(tokenTypes.RELATION, 'r5'));
    expected.addChild(union);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r6'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_can_change_precedence_of_set_operations_with_parenthesization = function() {
    this.parser = new Parser(new Lexer('(((((r1 ∪ r2) ∩ r3) − r4) ⨝ r5) × r6)'));
    var actual = this.parser.unionIntersection();
    var expected = new Ast(tokenTypes.CPROD);
    var union = new Ast(tokenTypes.UNION);
    union.addChild(new Ast(tokenTypes.RELATION, 'r1'));
    union.addChild(new Ast(tokenTypes.RELATION, 'r2'));
    var isect = new Ast(tokenTypes.ISECT);
    isect.addChild(union);
    isect.addChild(new Ast(tokenTypes.RELATION, 'r3'));
    var diff = new Ast(tokenTypes.DIFF);
    diff.addChild(isect);
    diff.addChild(new Ast(tokenTypes.RELATION, 'r4'));
    var njoin = new Ast(tokenTypes.NJOIN);
    njoin.addChild(diff);
    njoin.addChild(new Ast(tokenTypes.RELATION, 'r5'));
    expected.addChild(njoin);
    expected.addChild(new Ast(tokenTypes.RELATION, 'r6'));

    this.assertEqual(expected.toTreeString(), actual.toTreeString());
};

ParserTest.prototype.it_throws_an_error_if_parser_is_done_but_there_is_more_input = function() {
    this.parser = new Parser(new Lexer('r1 r2'));

    this.expectError(function() { this.parse(); }.bind(this.parser),
        'Expected end of input, but found ID.');
};










