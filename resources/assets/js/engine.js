import Ast from './language/Ast';
import Token from './language/Token';
import * as ops from './operations';

var relations = [
    {
        name: 'movies',
        attributes: ['id', 'title', 'year'],
        tuples: [
            { 'id': 1, 'title': 'Drive', 'year': 2007 },
            { 'id': 2, 'title': 'Brooklyn', 'year': 2015 },
            { 'id': 3, 'title': 'Gladiator', 'year': 2000 },
            { 'id': 4, 'title': 'Armageddon', 'year': 1998 },
            { 'id': 5, 'title': 'Ratatoullie', 'year': 2007 },
        ],
    },
    {
        name: 'lists',
        attributes: ['id', 'movieId'],
        tupes: [
            { 'id': 1, 'movieId': 2 },
            { 'id': 1, 'movieId': 3 },
            { 'id': 2, 'movieId': 1 },
            { 'id': 2, 'movieId': 4 },
            { 'id': 2, 'movieId': 5 },
        ],
    }
];


