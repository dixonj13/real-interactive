import Ast from './language/Ast';
import Lexer from './language/Lexer';
import Parser from './language/Parser';
import * as ops from './operations';
import * as table from './visualizations/table';
import { Engine } from './engine';
import { Visitor } from './language/Visitor';
import { tokenTypes } from './language/TokenTypes';

var data = {
    'movies': [
        { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
        { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
        { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
        { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
    ],
    'lists': [
        { 'lists.id': 1, 'lists.movieId': 2 },
        { 'lists.id': 1, 'lists.movieId': 3 },
        { 'lists.id': 2, 'lists.movieId': 1 },
        { 'lists.id': 2, 'lists.movieId': 4 },
        { 'lists.id': 2, 'lists.movieId': 5 },
    ],
    'images': [
        { 'images.url': 1, 'images.id': 'x', 'movies.id': 2, 'images.x': 1, 'list.id': 1 }
    ],
};

table.update('movies', Object.keys(data.movies[0]), data.movies, '#exp');

var input = 'π movies.id, title (movies)';
var lexer = new Lexer(input);
var parser = new Parser(lexer);
var tree = parser.relation();
console.log(tree.toTreeString());

var engine = new Engine(data);
var visitor = new Visitor(engine);
var r = tree.visit(visitor);
console.log(r);





