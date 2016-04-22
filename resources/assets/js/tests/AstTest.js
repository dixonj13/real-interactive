import { TestCase } from './TestCase.js';
import Token from '../language/Token.js';
import Ast from '../language/Ast.js';

/** Tests the Ast class. */
export var AstTest = function() {};

AstTest.prototype = new TestCase();

AstTest.prototype.it_is_an_Ast = function() {
    var ast = new Ast();
    this.assertTrue(ast instanceof Ast);
};

AstTest.prototype.it_can_be_constructed_with_null_which_creates_an_empty_token = function() {
    var ast = new Ast();
    this.assertNull(ast.token.type);
    this.assertNull(ast.token.value);
    this.assertNull(ast.children);
};

AstTest.prototype.it_can_be_constructed_with_strings_designating_the_token_type_and_value = function() {
    var ast = new Ast('FOO');
    this.assertEqual('FOO', ast.token.type);
    this.assertNull(ast.token.value);

    ast = new Ast(null, 'bar');
    this.assertNull(ast.token.type);
    this.assertEqual('bar', ast.token.value);

    ast = new Ast('BAZ', 'qux');
    this.assertEqual('BAZ', ast.token.type);
    this.assertEqual('qux', ast.token.value);
};

AstTest.prototype.it_can_be_constructed_with_an_instance_of_a_token = function() {
    var token = new Token('NUMBER', '2');
    var ast = new Ast(token);

    this.assertEqual('NUMBER', ast.token.type);
    this.assertEqual('2', ast.token.value);
};

AstTest.prototype.it_has_a_node_type_which_is_the_type_of_the_nodes_token = function() {
    var ast = new Ast('ID');
    this.assertEqual('ID', ast.getNodeType());

    ast = new Ast();
    this.assertNull(ast.getNodeType());

    ast = new Ast(new Token('Foo', 'bar'));
    this.assertEqual('Foo', ast.getNodeType());
};

AstTest.prototype.it_has_a_node_value_which_is_the_value_of_the_nodes_token = function() {
    var ast = new Ast('ID', 'foo');
    this.assertEqual('foo', ast.getNodeValue());

    ast = new Ast();
    this.assertNull(ast.getNodeValue());

    ast = new Ast(new Token('Foo', 'bar'));
    this.assertEqual('bar', ast.getNodeValue());
};

AstTest.prototype.it_has_the_ability_to_add_child_nodes = function() {
    var ast = new Ast();
    this.assertNull(ast.children);

    var child = new Ast('ID', 'first child');
    ast.addChild(child);
    this.assertNotNull(ast.children);
    this.assertEqual('ID', ast.children[0].getNodeType());
    this.assertEqual('first child', ast.children[0].getNodeValue());

    var child2 = new Ast('ID', 'second child');
    ast.addChild(child2);
    this.assertNotNull(ast.children);
    this.assertEqual('ID', ast.children[1].getNodeType());
    this.assertEqual('second child', ast.children[1].getNodeValue());
};

AstTest.prototype.it_is_a_leaf_if_it_has_no_children = function() {
    var ast = new Ast();
    this.assertTrue(ast.isLeaf());

    ast.addChild(new Ast());
    this.assertFalse(ast.isLeaf());

    ast.children.pop();
    this.assertTrue(ast.isLeaf());
};

AstTest.prototype.it_is_null_if_its_token_type_is_null = function() {
    var ast = new Ast();
    this.assertTrue(ast.isNull());

    ast = new Ast('ID');
    this.assertFalse(ast.isNull());
};

AstTest.prototype.it_has_a_string_representation_of_its_token = function() {
    var ast = new Ast(new Token('ID', 'bar'));
    this.assertEqual('<ID, bar>', ast.toString());
};

AstTest.prototype.it_has_a_string_representation_for_a_null_node = function() {
    var ast = new Ast();
    this.assertEqual('<null>', ast.toNodeString());
};

AstTest.prototype.it_has_a_string_representation_for_a_leaf_node = function() {
    var ast = new Ast('ID', 'leaf');
    this.assertEqual('<ID, leaf>', ast.toNodeString());
};

AstTest.prototype.it_has_a_string_representation_for_a_nonleaf_node = function() {
    var ast = new Ast('PLUS', null);
    ast.addChild(new Ast('NUMBER', '15'));
    ast.addChild(new Ast('NUMBER', '7'));
    this.assertEqual('<PLUS>', ast.toNodeString());
};

AstTest.prototype.it_has_a_tree_string_representation_with_the_ast_as_the_root_node = function() {
    var ast = new Ast('PLUS');
    ast.addChild(new Ast('NUMBER', '12'));
    ast.addChild(new Ast('NUMBER', '4'));

    this.assertEqual('(<PLUS> <NUMBER, 12> <NUMBER, 4>)', ast.toTreeString());

    var ast2 = new Ast('MINUS');
    ast2.addChild(ast);
    ast2.addChild(new Ast('NUMBER', '7'));

    this.assertEqual('(<MINUS> (<PLUS> <NUMBER, 12> <NUMBER, 4>) <NUMBER, 7>)', ast2.toTreeString());
};

AstTest.prototype.it_can_visit_the_ast_with_a_visitor_based_on_the_node_type = function() {
    // mock visitor with the ability to add two numbers
    var visitor = function() {
        this.visit = {
            NUMBER: function(node) {
                return node.getNodeValue();
            },
            PLUS: function(node) {
                return node.children[0].visit(this) + node.children[1].visit(this);
            },
        };
    };

    var ast = new Ast('PLUS');
    ast.addChild(new Ast('NUMBER', 12));
    ast.addChild(new Ast('NUMBER', 13));
    var vis = new visitor();

    this.assertEqual(25, ast.visit(vis));
};

