import { TestCase } from './TestCase';
import { Relation } from '../query_tools/Relation';

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

RelationTest.prototype.it_can_create_a_clone_of_a_relation_which_is_a_new_copy = function() {
    var clone = this.relation.clone();

    this.assertEqual(this.relation, clone);

    clone.tuples[1]['movies.id'] = 10;

    this.assertNotEqual(this.relation, clone);
};

RelationTest.prototype.it_can_return_an_array_of_qualified_attributes = function() {
    var expected = [
        'movies.id', 'movies.title', 'movies.year'
    ];

    var actual = this.relation.qualifiedAttributes();

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_return_an_array_of_unqualified_attributes = function() {
    var expected = ['id', 'title', 'year'];

    var actual = this.relation.unqualifiedAttributes();

    this.assertEqual(expected, actual);
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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

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

    var actual = this.relation.selection(selection);

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_rename_on_a_relation_producing_a_new_relation = function() {
    var bindings = {
        'movies.id': { attribute: 'identifier', qualifier: 'films' },
        'movies.title': { attribute: 'title', qualifier: 'films' },
        'movies.year': { attribute: 'released', qualifier: 'films' },
    };

    var actual = this.relation.rename(bindings);
    var expected = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.identifier': 1, 'films.title': 'Drive', 'films.released': 2007 },
            { 'films.identifier': 2, 'films.title': 'Brooklyn', 'films.released': 2015 },
            { 'films.identifier': 3, 'films.title': 'Gladiator', 'films.released': 2000 },
            { 'films.identifier': 4, 'films.title': 'Armageddon', 'films.released': 1998 },
            { 'films.identifier': 5, 'films.title': 'Ratatoullie', 'films.released': 2007 },
        ]
    );
    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_union_on_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.identifier': 9, 'films.name': 'Drive', 'films.released': 2007 },
            { 'films.identifier': 2, 'films.name': 'Serenity', 'films.released': 2015 },
            { 'films.identifier': 3, 'films.name': 'Gladiator', 'films.released': 1999 },
            { 'films.identifier': 4, 'films.name': 'Armageddon', 'films.released': 1998 },
            { 'films.identifier': 5, 'films.name': 'Ratatoullie', 'films.released': 2007 },
        ]
    );
    var actual = this.relation.union(relation2);
    var expected = new Relation(
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
            { 'movies.id': 9, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Serenity', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 1999 },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_an_intersection_on_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.identifier': 9, 'films.name': 'Drive', 'films.released': 2007 },
            { 'films.identifier': 2, 'films.name': 'Serenity', 'films.released': 2015 },
            { 'films.identifier': 3, 'films.name': 'Gladiator', 'films.released': 1999 },
            { 'films.identifier': 4, 'films.name': 'Armageddon', 'films.released': 1998 },
            { 'films.identifier': 5, 'films.name': 'Ratatoullie', 'films.released': 2007 },
        ]
    );
    var actual = this.relation.intersection(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_take_the_difference_of_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.identifier': 9, 'films.name': 'Drive', 'films.released': 2007 },
            { 'films.identifier': 2, 'films.name': 'Serenity', 'films.released': 2015 },
            { 'films.identifier': 3, 'films.name': 'Gladiator', 'films.released': 1999 },
            { 'films.identifier': 4, 'films.name': 'Armageddon', 'films.released': 1998 },
            { 'films.identifier': 5, 'films.name': 'Ratatoullie', 'films.released': 2007 },
        ]
    );
    var actual = this.relation.difference(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000 },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_take_the_cartesian_product_of_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.name': 'Drive', 'films.identifier': 9 },
            { 'films.name': 'Serenity', 'films.identifier': 2 },
        ]
    );
    var actual = this.relation.cartesianProduct(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.name': 'Drive', 'films.identifier': 9 },
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.name': 'Serenity', 'films.identifier': 2 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'films.name': 'Drive', 'films.identifier': 9 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'films.name': 'Serenity', 'films.identifier': 2 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'films.name': 'Drive', 'films.identifier': 9 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'films.name': 'Serenity', 'films.identifier': 2 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'films.name': 'Drive', 'films.identifier': 9 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'films.name': 'Serenity', 'films.identifier': 2 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'films.name': 'Drive', 'films.identifier': 9 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'films.name': 'Serenity', 'films.identifier': 2 },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_natural_join_of_two_relations_with_one_attribute_in_common = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.identifier': 7, 'films.title': 'Drive', 'films.url': '/images/7.jpg' },
            { 'films.identifier': 9, 'films.title': 'Gladiator', 'films.url': '/images/9.jpg' },
            { 'films.identifier': 13, 'films.title': 'Predator', 'films.url': '/images/13.jpg' },
        ]
    );
    var actual = this.relation.naturalJoin(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.identifier': 7, 'films.url': '/images/7.jpg' },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'films.identifier': 9, 'films.url': '/images/9.jpg' },
        ]
    );

   this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_natural_join_with_more_than_one_attribute_in_common = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.id': 1, 'films.title': 'Drive', 'films.url': '/images/1.jpg' },
            { 'films.id': 3, 'films.title': 'Gladiator', 'films.url': '/images/3.jpg' },
            { 'films.id': 4, 'films.title': 'Predator', 'films.url': '/images/4.jpg' },
        ]
    );

    var actual = this.relation.naturalJoin(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.url': '/images/1.jpg' },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'films.url': '/images/3.jpg' },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_can_perform_a_natural_join_on_more_than_one_occurrence_of_an_attribute = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'title', 'qualifier': 'bookmarks', 'type': 'string' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.id': 1, 'films.title': 'Drive', 'bookmarks.title': 'Drive', 'films.url': '/images/1.jpg' },
            { 'films.id': 3, 'films.title': 'Gladiator', 'bookmarks.title': 'Gladiator', 'films.url': '/images/3.jpg' },
            { 'films.id': 8, 'films.title': 'Brooklyn', 'bookmarks.title': 'Favorite', 'films.url': '/images/8.jpg' },
        ]
    );
    var actual = this.relation.naturalJoin(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'url', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.url': '/images/1.jpg' },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'films.url': '/images/3.jpg' },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_produces_the_cartesian_product_when_a_natural_join_has_nothing_to_join_on = function() {
    var relation2 = new Relation(
        [
            { attribute: 'rating', qualifier: 'favorites', type: 'number' },
            { attribute: 'votes', qualifier: 'favorites', type: 'number' }
        ],
        [
            { 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'favorites.rating': 4, 'favorites.votes': 192 }
        ]
    );
    var actual = this.relation.naturalJoin(relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { attribute: 'rating', qualifier: 'favorites', type: 'number' },
            { attribute: 'votes', qualifier: 'favorites', type: 'number' }
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'favorites.rating': 4, 'favorites.votes': 192 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'favorites.rating': 4, 'favorites.votes': 192 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'favorites.rating': 4, 'favorites.votes': 192 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'favorites.rating': 4, 'favorites.votes': 192 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'favorites.rating': 9, 'favorites.votes': 244 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'favorites.rating': 4, 'favorites.votes': 192 },
        ]
    );

    this.assertEqual(expected, actual);
};

RelationTest.prototype.it_produces_the_same_relation_when_natural_joining_a_relation_on_itself = function() {
    var actual = this.relation.naturalJoin(this.relation);

    this.assertEqual(this.relation, actual);
};
