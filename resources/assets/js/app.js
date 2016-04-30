
import Ast from './language/Ast';
import Lexer from './language/Lexer';
import Parser from './language/Parser';
import * as table from './visualizations/table';
import { Engine } from './query_tools/Engine';
import { Relation } from './query_tools/Relation';
import { tokenTypes } from './language/TokenTypes';
import { Visitor as EvalVisitor } from './language/visitors/EvalVisitor';

import * as editor from './editor/editor.js';

var data = {
    'countries': new Relation(
        [
            { 'attribute': 'name', 'qualifier': 'countries', 'type': 'string' },
            { 'attribute': 'code', 'qualifier': 'countries', 'type': 'string' },
            { 'attribute': 'founded', 'qualifier': 'countries', 'type': 'number' },
        ],
        [
            { 'countries.name': 'United States', 'countries.code': 'US', 'countries.founded': 1776 },
            { 'countries.name': 'Argentina', 'countries.code': 'AR', 'countries.founded': 1816 },
            { 'countries.name': 'Yemen', 'countries.code': 'YE', 'countries.founded': 1990 },
            { 'countries.name': 'Ghana', 'countries.code': 'GH', 'countries.founded': 1957 },
            { 'countries.name': 'Mongolia', 'countries.code': 'MO', 'countries.founded': 1207 },
            { 'countries.name': 'New Zealand', 'countries.code': 'NZ', 'countries.founded': 1840 },
        ]
    ),
    'lakes': new Relation(
        [
            { 'attribute': 'name', 'qualifier': 'lakes', 'type': 'string' },
            { 'attribute': 'country', 'qualifier': 'lakes', 'type': 'string' },
            { 'attribute': 'surface_area', 'qualifier': 'lakes', 'type': 'number' },
        ],
        [
            { 'lakes.name': 'Taupo', 'lakes.country': 'NZ', 'lakes.surface_area': 616 },
            { 'lakes.name': 'Khyargas', 'lakes.country': 'MO', 'lakes.surface_area': 1407 },
            { 'lakes.name': 'Umiam', 'lakes.country': 'IN', 'lakes.surface_area': 220 },
            { 'lakes.name': 'Volta', 'lakes.country': 'GH', 'lakes.surface_area': 8502 },
            { 'lakes.name': 'Erie', 'lakes.country': 'US', 'lakes.surface_area': 9910 },
            { 'lakes.name': 'Bosumtwi', 'lakes.country': 'GH', 'lakes.surface_area': 49 },
            { 'lakes.name': 'Jordan', 'lakes.country': 'US', 'lakes.surface_area': 129 },
            { 'lakes.name': 'Superior', 'lakes.country': 'US', 'lakes.surface_area': 31700 },
            { 'lakes.name': 'Sangiin Dalai', 'lakes.country': 'MO', 'lakes.surface_area': 165 },
            { 'lakes.name': 'Nahuel Huapi', 'lakes.country': 'AR', 'lakes.surface_area': 530 },
            { 'lakes.name': 'Uvs', 'lakes.country': 'MO', 'lakes.surface_area': 3350 },
            { 'lakes.name': 'Wanaka', 'lakes.country': 'NZ', 'lakes.surface_area': 192 },
        ]
    ),
    'population': new Relation(
        [
            { 'attribute': 'country', 'qualifier': 'population', 'type': 'string' },
            { 'attribute': 'number', 'qualifier': 'population', 'type': 'number' },
        ],
        [
            { 'population.country': 'IN', 'population.number': 1252000000 },
            { 'population.country': 'NZ', 'population.number': 4471000 },
            { 'population.country': 'AR', 'population.number': 40412000 },
            { 'population.country': 'MO', 'population.number': 2839000 },
            { 'population.country': 'YE', 'population.number': 24410000 },
            { 'population.country': 'US', 'population.number': 318900000 },
            { 'population.country': 'GH', 'population.number': 25900000 },
            { 'population.country': 'IE', 'population.number': 4595000 },
        ]
    ),
    'area': new Relation(
        [
            { 'attribute': 'country', 'qualifier': 'area', 'type': 'string' },
            { 'attribute': 'number', 'qualifier': 'area', 'type': 'number' },
        ],
        [
            { 'area.country': 'NZ', 'area.number': 103483 },
            { 'area.country': 'GH', 'area.number': 92099 },
            { 'area.country': 'US', 'area.number': 3806000 },
            { 'area.country': 'MO', 'area.number': 604600 },
            { 'area.country': 'IN', 'area.number': 1269000 },
            { 'area.country': 'YE', 'area.number': 203891 },
            { 'area.country': 'ES', 'area.number': 194845 },
            { 'area.country': 'AR', 'area.number': 1074000 },
            { 'area.country': 'ZW', 'area.number': 150872 },
        ]
    )
};

editor.init(data);






