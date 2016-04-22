import Ast from './language/Ast';
import Lexer from './language/Lexer';
import Parser from './language/Parser';
import * as ops from './operations';
import * as table from './visualizations/table';
import { Engine } from './engine';
import { tokenTypes } from './language/TokenTypes';
import { Visitor as EvalVisitor } from './language/visitors/EvalVisitor';

var data = {
    'movies': {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    },
    'lists': {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'lists.id': 1, 'lists.movieId': 2 },
            { 'lists.id': 1, 'lists.movieId': 3 },
            { 'lists.id': 2, 'lists.movieId': 1 },
            { 'lists.id': 2, 'lists.movieId': 4 },
            { 'lists.id': 2, 'lists.movieId': 5 },
        ]
    },
};

table.update('movies', data.movies.attributes.map(a => { return a.qualifier+'.'+a.attribute; }), data.movies.tuples, '#data');

var input = 'π title, movies.year (movies)';
var lexer = new Lexer(input);
var parser = new Parser(lexer);
var tree = parser.relation();
console.log(tree.toTreeString());

var engine = new Engine(data);
var visitor = new EvalVisitor(engine);
var r = tree.visit(visitor);
console.log(r);

table.update(null, r.attributes.map(a => { return a.qualifier+'.'+a.attribute; }), r.tuples, '#output');

input = 'σ (movies.year > 2007 ∨ title = "Gladiator") ∧ (id > 1) (movies)';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.attributes.map(a => { return a.qualifier+'.'+a.attribute; }), r.tuples, '#output2');

input = 'π title, movies.year (σ (movies.year > 2007 ∨ title = "Gladiator") ∧ (id > 1) (movies))';
lexer = new Lexer(input);
parser = new Parser(lexer);
tree = parser.relation();
console.log(tree.toTreeString());

r = tree.visit(visitor);
console.log(r);

table.update(null, r.attributes.map(a => { return a.qualifier+'.'+a.attribute; }), r.tuples, '#output3');




