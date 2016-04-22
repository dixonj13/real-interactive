import { TestCase } from './TestCase';
import * as operations from '../operations';

/** Tests the Lexer class. */
export var OperationsTest = function() {};

OperationsTest.prototype = new TestCase();

OperationsTest.prototype.setUp = function() {
    this.relation = {
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
    };
};

OperationsTest.prototype.it_can_perform_a_projection_on_a_relation = function() {
    var projection = [
        { attribute: 'title', qualifier: 'movies', type: 'string' },
        { attribute: 'year', qualifier: 'movies', type: 'number' },
    ];
    var expected = {
        attributes: [
            { attribute: 'title', qualifier: 'movies', type: 'string' },
            { attribute: 'year', qualifier: 'movies', type: 'number' },
        ],
        tuples: [
            { 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ],
    };

    var actual = operations.projection(projection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_returns_a_relation_with_no_tuples_for_a_selection_with_no_matches = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '==',
        rhs: 'Star Wars',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': []
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_equals_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '==',
        rhs: 'Gladiator',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_not_equal_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '!=',
        rhs: 'Gladiator',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_less_than_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '<',
        rhs: 'Drive',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_less_than_or_eql_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '<=',
        rhs: 'Drive',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_greater_than_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '>',
        rhs: 'Drive',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_greater_than_or_eql_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '>=',
        rhs: 'Drive',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_equals_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '==',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_not_equals_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '!=',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_less_than_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '<',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_less_than_or_eql_to_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '<=',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_greater_than_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '>',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_greater_than_or_eql_to_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '>=',
        rhs: 2007,
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_AND = function() {
    var selection = {
        lhs: {
            lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
            op: '<',
            rhs: 2015,
        },
        op: 'AND',
        rhs: {
            lhs: 2000,
            op: '<',
            rhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        }
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_OR = function() {
    var selection = {
        lhs: {
            lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
            op: '>',
            rhs: 2007,
        },
        op: 'OR',
        rhs: {
            lhs: 2007,
            op: '>',
            rhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        }
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_can_perform_a_selection_using_NOT = function() {
    var selection = {
        lhs: {
            lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
            op: '==',
            rhs: 2007,
        },
        op: 'NOT',
    };
    var expected = {
        'attributes': [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        'tuples': [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    };

    var actual = operations.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

OperationsTest.prototype.it_throws_an_error_when_selectin_with_an_ill_formed_predicate = function() {
    var selection = {
        lhs: {
            lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
            op: '==',
            rhs: 2007,
        },
        op: 'NO',
    };
    
    this.expectError(function() { operations.select(selection, this.relation); }.bind(operations, this),
        'Ill-formed predicate');
};