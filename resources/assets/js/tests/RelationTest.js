import { TestCase } from './TestCase';
import { Relation } from '../Relation';

export var RelationTest = function() {};

RelationTest.prototype = new TestCase();

RelationTest.prototype.setUp = function() {
    var attributes = [
        { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
        { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
        { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
    ];
    var tuples = [
        { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
        { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
        { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
        { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
    ];
    this.relation = new Relation(attributes, tuples);
};

RelationTest.prototype.it_can_perform_a_projection_on_a_relation = function() {
    var projection = [
        { attribute: 'title', qualifier: 'movies', type: 'string' },
        { attribute: 'year', qualifier: 'movies', type: 'number' },
    ];
    var expected = new Relation(
        [
            { attribute: 'title', qualifier: 'movies', type: 'string' },
            { attribute: 'year', qualifier: 'movies', type: 'number' },
        ],
        [
            { 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.projection(projection);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_returns_a_relation_with_no_tuples_for_a_selection_with_no_matches = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '==',
        rhs: 'Star Wars',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        []
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_equals_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '==',
        rhs: 'Gladiator',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_not_equal_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '!=',
        rhs: 'Gladiator',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_less_than_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '<',
        rhs: 'Drive',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_less_than_or_eql_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '<=',
        rhs: 'Drive',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_greater_than_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '>',
        rhs: 'Drive',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_greater_than_or_eql_to_on_two_strings = function() {
    var selection = {
        lhs: { attribute: 'title', qualifier: 'movies', type: 'string' },
        op: '>=',
        rhs: 'Drive',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_equals_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '==',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_not_equals_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '!=',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_less_than_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '<',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_less_than_or_eql_to_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '<=',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_greater_than_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '>',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_greater_than_or_eql_to_on_two_numbers = function() {
    var selection = {
        lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
        op: '>=',
        rhs: 2007,
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_AND = function() {
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
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_OR = function() {
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
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_selection_using_NOT = function() {
    var selection = {
        lhs: {
            lhs: { attribute: 'year', qualifier: 'movies', type: 'number' },
            op: '==',
            rhs: 2007,
        },
        op: 'NOT',
    };
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );

    var actual = this.relation.selection(selection, this.relation);

    this.assertEqual(expected, actual);
};

