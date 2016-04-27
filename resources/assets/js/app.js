import Ast from './language/Ast';
import Lexer from './language/Lexer';
import Parser from './language/Parser';
import * as table from './visualizations/table';
import { Engine } from './query_tools/Engine';
import { Relation } from './query_tools/Relation';
import { tokenTypes } from './language/TokenTypes';
import { Visitor as EvalVisitor } from './language/visitors/EvalVisitor';

var data = {
    'movies': new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    ),
    'lists': new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'lists', 'type': 'number' },
            { 'attribute': 'movie_id', 'qualifier': 'lists', 'type': 'number' },
        ],
        [
            { 'lists.id': 1, 'lists.movie_id': 2 },
            { 'lists.id': 1, 'lists.movie_id': 3 },
            { 'lists.id': 2, 'lists.movie_id': 1 },
            { 'lists.id': 2, 'lists.movie_id': 4 },
            { 'lists.id': 2, 'lists.movie_id': 5 },
        ]
    ),
};
table.update('movies', data.movies.qualifiedAttributes(), data.movies.tuples, '#data');

var input = 'π title, movies.year (movies)';
var lexer = new Lexer(input);
var parser = new Parser(lexer);
var tree = parser.relation();
console.log(tree.toTreeString());

var engine = new Engine(data);
var visitor = new EvalVisitor(engine);
var r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output');

input = 'σ (movies.year > 2007 ∨ title = "Gladiator") ∧ (id > 1) (movies)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output2');

input = 'π title, movies.year (σ (movies.year > 2007 ∨ title = "Gladiator") ∧ (id > 1) (movies))';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output3');

input = 'σ 4 = 4 ∨ title = "nothing" (movies))';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output4');

input = 'ρ films (movies)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output5');

input = 'ρ films [identifier, movies.title, released] (movies)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.qualifiedAttributes(), r.tuples, '#output6');



