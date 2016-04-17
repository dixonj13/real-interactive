import Ast from './language/Ast';
import Lexer from './language/Lexer';
import Parser from './language/Parser';
import * as ops from './operations';
import * as table from './visualizations/table';
import { Visitor } from './language/Visitor';
import { tokenTypes } from './language/TokenTypes';

var relations = [
    {
        name: 'food',
        attributes: ['vegetable', 'fruit', 'meat'],
        tuples: [
            { vegetable: 'broccoli', meat: 'pork'},
            { vegetable: 'broccoli', fruit: 'apple', meat: 'fish'},
            { vegetable: 'squash', fruit: 'pear', meat: 'steak'},
            { vegetable: 'carrot', fruit: 'banana', meat: 'chicken'},
        ],
    },
];

var attributes = ['meat', 'fruit'];

var result = ops.projection(attributes, relations[0]);

table.update(relations[0].name, relations[0].attributes, relations[0].tuples, '#data');
table.update(null, attributes, result, '#output');

var input = 'σ table1.x = 1 ∧ (y != 2 ∨ z > -4) (table1)';
var lexer = new Lexer(input);
var parser = new Parser(lexer);
var tree = parser.relation();
console.log(tree.toTreeString());

input = 'π table1.x, table1.y (table1)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

var visitor = new Visitor();
var out = tree.visit(visitor);

input = '(table1)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();

visitor = new Visitor();
out = tree.visit(visitor);











