import { Engine } from '../query_tools/Engine';
import { TestCase } from './TestCase';
import { Relation } from '../query_tools/Relation';

/** Tests the Engine class. */
export var EngineTest = function() {};

EngineTest.prototype = new TestCase();

EngineTest.prototype.setUp = function() {

    this.engine = new Engine({
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
                { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
                { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
                { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            ],
            [
                { 'lists.id': 1, 'lists.movieId': 2 },
                { 'lists.id': 1, 'lists.movieId': 3 },
                { 'lists.id': 2, 'lists.movieId': 1 },
                { 'lists.id': 2, 'lists.movieId': 4 },
                { 'lists.id': 2, 'lists.movieId': 5 },
            ]
        ),
    });
};

// REQ-ID: ENGINE_1
// TEST-ID: 1
EngineTest.prototype.it_can_look_up_a_relation_in_the_data_set = function() {
    var actual = this.engine.lookup('lists');
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'lists.id': 1, 'lists.movieId': 2 },
            { 'lists.id': 1, 'lists.movieId': 3 },
            { 'lists.id': 2, 'lists.movieId': 1 },
            { 'lists.id': 2, 'lists.movieId': 4 },
            { 'lists.id': 2, 'lists.movieId': 5 },
        ]
    );
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_1
// TEST-ID: 2
EngineTest.prototype.it_throws_an_error_if_it_cannot_find_a_relation = function() {
    this.expectError(function() { this.lookup('bookmarks'); }.bind(this.engine),
        'Relation bookmarks does not exist.');
};

// REQ-ID: ENGINE_2
// TEST-ID: 3
EngineTest.prototype.it_can_perform_a_projection_with_no_qualifiers = function() {
    var movies = this.engine.dataSet.movies;
    var actual = this.engine.project(movies, [{ attribute: 'title' }]);
    var expected = new Relation(
        [
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
        ],
        [
            { 'movies.title': 'Drive' },
            { 'movies.title': 'Brooklyn' },
            { 'movies.title': 'Gladiator' },
            { 'movies.title': 'Armageddon' },
            { 'movies.title': 'Ratatoullie' },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_2
// TEST-ID: 4
EngineTest.prototype.it_can_perform_a_projection_with_qualifiers = function() {
    var bookmarks = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'bookmark', 'type': 'number' },
            { 'attribute': 'id', 'qualifier': 'movie', 'type': 'number' }
        ],
        [
            { 'bookmark.id': 1, 'movie.id': 4 },
            { 'bookmark.id': 2, 'movie.id': 2 },
            { 'bookmark.id': 3, 'movie.id': 7 },
        ]
    );
    var actual = this.engine.project(bookmarks, [{ attribute: 'id', 'qualifier': 'bookmark' }]);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'bookmark', 'type': 'number' },
        ],
        [
            { 'bookmark.id': 1 },
            { 'bookmark.id': 2 },
            { 'bookmark.id': 3 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_2
// TEST-ID: 5
EngineTest.prototype.it_throws_an_error_if_a_projection_is_ambiguous = function() {
    var bookmarks = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'bookmark', 'type': 'number' },
            { 'attribute': 'id', 'qualifier': 'movie', 'type': 'number' }
        ],
        [
            { 'bookmark.id': 1, 'movie.id': 4 },
            { 'bookmark.id': 2, 'movie.id': 2 },
            { 'bookmark.id': 3, 'movie.id': 7 },
        ]
    );

    this.expectError(function() { 
        this.project(bookmarks, [{ attribute: 'id' }]); 
    }.bind(this.engine), 'id is ambiguous.');
};

// REQ-ID: ENGINE_2
// TEST-ID: 6
EngineTest.prototype.it_throws_an_error_when_projecting_if_an_unqualified_attribute_does_not_exist = function() {
    this.expectError(function() { 
        this.project(this.dataSet.movies, [{ attribute: 'url' }]); 
    }.bind(this.engine), 'url does not exist.');
};

// REQ-ID: ENGINE_2
// TEST-ID: 7
EngineTest.prototype.it_throws_an_error_when_projecting_if_a_qualified_attribute_does_not_exist = function() {
    this.expectError(function() { 
        this.project(this.dataSet.movies, [{ attribute: 'url', 'qualifier': 'movies' }]); 
    }.bind(this.engine), 'movies.url does not exist.');
};

// REQ-ID: ENGINE_2
// TEST-ID: 8
EngineTest.prototype.it_throws_an_error_when_projecting_if_a_qualifier_does_not_exist = function() {
    this.expectError(function() { 
        this.project(this.dataSet.movies, [{ attribute: 'id', 'qualifier': 'lists' }]); 
    }.bind(this.engine), 'lists.id does not exist.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 9
EngineTest.prototype.it_can_perform_a_selection_using_equals = function() {
    var predicate = { lhs: 4, op: '==', rhs: 4 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 10
EngineTest.prototype.it_can_perform_a_selection_using_not_equals = function() {
    var predicate = { lhs: 4, op: '!=', rhs: 2 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 11
EngineTest.prototype.it_can_perform_a_selection_using_greater_than = function() {
    var predicate = { lhs: 4, op: '>', rhs: 2 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 12
EngineTest.prototype.it_can_perform_a_selection_using_greater_than_or_equal_to = function() {
    var predicate = { lhs: 4, op: '>=', rhs: 4 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 13
EngineTest.prototype.it_can_perform_a_selection_using_less_than = function() {
    var predicate = { lhs: 2, op: '<', rhs: 4 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 14
EngineTest.prototype.it_can_perform_a_selection_using_less_than_or_equal_to = function() {
    var predicate = { lhs: 4, op: '<=', rhs: 4 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 15
EngineTest.prototype.it_can_perform_a_selection_using_two_numbers = function() {
    var predicate = { lhs: 881241, op: '>', rhs: 121123 };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 16
EngineTest.prototype.it_can_perform_a_selection_using_two_strings = function() {
    var predicate = { lhs: 'hello', op: '!=', rhs: 'goodbye' };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 17
EngineTest.prototype.it_can_perform_a_selection_using_attributes = function() {
    var predicate = { 
        lhs: { attribute: 'id' },
        op: '<', 
        rhs: { attribute: 'year' },
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 18
EngineTest.prototype.it_can_perform_a_selection_using_an_attribute_of_type_string_and_a_string = function() {
    var predicate = { 
        lhs: { attribute: 'title', 'qualifier': 'movies' },
        op: '==', 
        rhs: 'Ratatoullie'
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 19
EngineTest.prototype.it_can_perform_a_selection_using_an_attribute_of_type_number_and_a_number = function() {
    var predicate = { 
        lhs: 2007,
        op: '<', 
        rhs: { attribute: 'year', 'qualifier': 'movies' },
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 20
EngineTest.prototype.it_throws_an_error_if_two_attributes_do_not_have_the_same_type = function() {
    var predicate = { 
        lhs: { attribute: 'title' },
        op: '<', 
        rhs: { attribute: 'year' },
    };
    this.expectError(function() { 
        this.select(this.dataSet.movies, predicate);
    }.bind(this.engine), 
        'movies.title of type string cannot be compared with movies.year of type number.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 21
EngineTest.prototype.it_throws_an_error_if_a_string_is_compared_with_a_number = function() {
    var predicate = { 
        lhs: 4,
        op: '<', 
        rhs: 'foo',
    };
    this.expectError(function() { 
        this.select(this.dataSet.movies, predicate);
    }.bind(this.engine), 
        '4 of type number cannot be compared with foo of type string.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 22
EngineTest.prototype.it_throws_an_error_if_an_attribute_of_type_string_is_compared_with_a_number = function() {
    var predicate = { 
        lhs: { attribute: 'title' },
        op: '<', 
        rhs: 4,
    };
    this.expectError(function() { 
        this.select(this.dataSet.movies, predicate);
    }.bind(this.engine), 
        'movies.title of type string cannot be compared with 4 of type number.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 23
EngineTest.prototype.it_throws_an_error_if_an_attribute_of_type_number_is_compared_with_a_string = function() {
    var predicate = { 
        lhs: { attribute: 'year' },
        op: '<', 
        rhs: '2004',
    };
    this.expectError(function() { 
        this.select(this.dataSet.movies, predicate);
    }.bind(this.engine), 
        'movies.year of type number cannot be compared with 2004 of type string.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 24
EngineTest.prototype.it_can_perform_a_selection_using_AND = function() {
    var predicate = { 
        lhs: {
            lhs: { attribute: 'id' },
            op: '>',
            rhs: 3
        },
        op: 'AND', 
        rhs: {
            lhs: { attribute: 'year' },
            op: '<',
            rhs: 2000
        },
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 25
EngineTest.prototype.it_can_perform_a_selection_using_OR = function() {
    var predicate = { 
        lhs: {
            lhs: { attribute: 'id' },
            op: '>',
            rhs: 3
        },
        op: 'OR', 
        rhs: {
            lhs: { attribute: 'title' },
            op: '==',
            rhs: 'Brooklyn'
        },
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 26
EngineTest.prototype.it_can_perform_a_selection_using_NOT = function() {
    var predicate = { 
        lhs: {
            lhs: { attribute: 'title' },
            op: '==',
            rhs: 'Armageddon'
        },
        op: 'NOT', 
    };
    var actual = this.engine.select(this.engine.dataSet.movies, predicate);
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
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );
    
    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_3
// TEST-ID: 27
EngineTest.prototype.it_throws_an_error_if_a_selection_is_ambiguous = function() {
    var bookmarks = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'bookmark', 'type': 'number' },
            { 'attribute': 'id', 'qualifier': 'movie', 'type': 'number' }
        ],
        [
            { 'bookmark.id': 1, 'movie.id': 4 },
            { 'bookmark.id': 2, 'movie.id': 2 },
            { 'bookmark.id': 3, 'movie.id': 7 },
        ]
    );
    var projection = { 
        lhs: { attribute: 'id' },
        op: '<', 
        rhs: 4 
    };

    this.expectError(function() { 
        this.select(bookmarks, projection); 
    }.bind(this.engine), 'id is ambiguous.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 28
EngineTest.prototype.it_throws_an_error_when_selecting_if_an_unqualified_attribute_does_not_exist = function() {
    var projection = { 
        lhs: { attribute: 'url' },
        op: '<', 
        rhs: 4 
    };

    this.expectError(function() { 
        this.select(this.dataSet.movies, projection); 
    }.bind(this.engine), 'url does not exist.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 29
EngineTest.prototype.it_throws_an_error_when_selecting_if_a_qualified_attribute_does_not_exist = function() {
    var projection = { 
        lhs: { attribute: 'url', qualifier: 'movies' },
        op: '<', 
        rhs: 4 
    };

    this.expectError(function() { 
        this.select(this.dataSet.movies, projection); 
    }.bind(this.engine), 'movies.url does not exist.');
};

// REQ-ID: ENGINE_3
// TEST-ID: 30
EngineTest.prototype.it_throws_an_error_when_selecting_if_a_qualifier_does_not_exist = function() {
    var projection = { 
        lhs: { attribute: 'id', qualifier: 'lists' },
        op: '<', 
        rhs: 4 
    };

    this.expectError(function() { 
        this.select(this.dataSet.movies, projection); 
    }.bind(this.engine), 'lists.id does not exist.');
};

// REQ-ID: ENGINE_4
// TEST-ID: 31
EngineTest.prototype.it_can_perform_a_rename_on_a_relation_using_just_a_name = function() {
    var actual = this.engine.rename(this.engine.dataSet.movies, 'films', []);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.id': 1, 'films.title': 'Drive', 'films.year': 2007 },
            { 'films.id': 2, 'films.title': 'Brooklyn', 'films.year': 2015 },
            { 'films.id': 3, 'films.title': 'Gladiator', 'films.year': 2000 },
            { 'films.id': 4, 'films.title': 'Armageddon', 'films.year': 1998 },
            { 'films.id': 5, 'films.title': 'Ratatoullie', 'films.year': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_4
// TEST-ID: 32
EngineTest.prototype.it_can_perform_a_rename_using_a_name_and_a_list_of_attributes = function() {
    var attributes = [
        { attribute: 'identifier' },
        { attribute: 'name' },
        { attribute: 'released' }
    ];
    var actual = this.engine.rename(this.engine.dataSet.movies, 'films', attributes);
    var expected = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.identifier': 1, 'films.name': 'Drive', 'films.released': 2007 },
            { 'films.identifier': 2, 'films.name': 'Brooklyn', 'films.released': 2015 },
            { 'films.identifier': 3, 'films.name': 'Gladiator', 'films.released': 2000 },
            { 'films.identifier': 4, 'films.name': 'Armageddon', 'films.released': 1998 },
            { 'films.identifier': 5, 'films.name': 'Ratatoullie', 'films.released': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_4
// TEST-ID: 33
EngineTest.prototype.it_can_perform_a_rename_using_a_name_and_a_list_of_potentially_qualified_attributes = function() {
    var attributes = [
        { attribute: 'identifier' },
        { attribute: 'name', qualifier: 'Q' },
        { attribute: 'released', qualifier: 'S' }
    ];
    var actual = this.engine.rename(this.engine.dataSet.movies, 'films', attributes);
    var expected = new Relation(
        [
            { 'attribute': 'identifier', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'name', 'qualifier': 'Q', 'type': 'string' },
            { 'attribute': 'released', 'qualifier': 'S', 'type': 'number' },
        ],
        [
            { 'films.identifier': 1, 'Q.name': 'Drive', 'S.released': 2007 },
            { 'films.identifier': 2, 'Q.name': 'Brooklyn', 'S.released': 2015 },
            { 'films.identifier': 3, 'Q.name': 'Gladiator', 'S.released': 2000 },
            { 'films.identifier': 4, 'Q.name': 'Armageddon', 'S.released': 1998 },
            { 'films.identifier': 5, 'Q.name': 'Ratatoullie', 'S.released': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_4
// TEST-ID: 34
EngineTest.prototype.it_throws_an_error_renaming_for_an_attribute_list_not_matching_the_actual_number_of_attributes = function() {
    var attributes = [
        { attribute: 'identifier' },
        { attribute: 'name' },
    ];

    this.expectError(function() { 
        this.rename(this.dataSet.movies, 'films', attributes); 
    }.bind(this.engine), 'Rename to films requires 3 attributes.');
};

// REQ-ID: ENGINE_4
// TEST-ID: 35
EngineTest.prototype.it_throws_an_error_renaming_with_an_attribute_list_that_contains_duplicates = function() {
    var attributes = [
        { attribute: 'identifier' },
        { attribute: 'name' },
        { attribute: 'name' },
    ];

    this.expectError(function() { 
        this.rename(this.dataSet.movies, 'films', attributes); 
    }.bind(this.engine), 'Rename to films contains duplicate attribute names.');
};

// REQ-ID: ENGINE_4
// TEST-ID: 36
EngineTest.prototype.it_throws_an_error_if_renaming_without_an_attribute_list_would_be_ambiguous = function() {
    var bookmarks = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'bookmark', 'type': 'number' },
            { 'attribute': 'id', 'qualifier': 'movie', 'type': 'number' }
        ],
        [
            { 'bookmark.id': 1, 'movie.id': 4 },
            { 'bookmark.id': 2, 'movie.id': 2 },
            { 'bookmark.id': 3, 'movie.id': 7 },
        ]
    );

    this.expectError(function() { 
        this.rename(bookmarks, 'favorites', []); 
    }.bind(this.engine), 'Rename to favorites would be ambiguous.');
};

// REQ-ID: ENGINE_5
// TEST-ID: 37
EngineTest.prototype.it_can_perform_a_union_of_two_relations_with_the_same_arity = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'date', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );
    var actual = this.engine.union(this.engine.dataSet.movies, relation2);
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
            { 'movies.id': 8, 'movies.title': 'Brooklyn', 'movies.year': 2003 },
            { 'movies.id': 9, 'movies.title': 'Armageddon', 'movies.year': 1999 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_5
// TEST-ID: 38
EngineTest.prototype.it_throws_an_exception_when_unioning_two_relations_with_a_different_number_of_attributes = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );

    this.expectError(function() { 
        this.union(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Union cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_5
// TEST-ID: 39
EngineTest.prototype.it_throws_an_exception_when_unioning_two_relations_with_different_types = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'director', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.director': 'Mike Leigh' },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.director': 'Akira Kurowasa' },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.director': 'Richard Linklater' },
        ]
    );

    this.expectError(function() { 
        this.union(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Union cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_6
// TEST-ID: 40
EngineTest.prototype.it_can_take_the_intersection_of_two_relations_with_the_same_arity = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'date', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );
    var actual = this.engine.intersection(this.engine.dataSet.movies, relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_6
// TEST-ID: 41
EngineTest.prototype.it_throws_an_exception_when_intersecting_two_relations_with_a_different_number_of_attributes = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );

    this.expectError(function() { 
        this.intersection(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Intersection cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_6
// TEST-ID: 42
EngineTest.prototype.it_throws_an_exception_when_intersecting_two_relations_with_different_types = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'director', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.director': 'Mike Leigh' },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.director': 'Akira Kurowasa' },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.director': 'Richard Linklater' },
        ]
    );

    this.expectError(function() { 
        this.intersection(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Intersection cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_7
// TEST-ID: 43
EngineTest.prototype.it_can_take_the_difference_of_two_relations_with_the_same_arity = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'date', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );
    var actual = this.engine.difference(this.engine.dataSet.movies, relation2);
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
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_7
// TEST-ID: 44
EngineTest.prototype.it_throws_an_exception_when_taking_the_difference_of_two_relations_with_a_different_number_of_attributes = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.date': 2007 },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.date': 2003 },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.date': 1999 },
        ]
    );

    this.expectError(function() { 
        this.difference(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Difference cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_7
// TEST-ID: 45
EngineTest.prototype.it_throws_an_exception_when_taking_the_difference_of_two_relations_with_different_types = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'fid', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'film_name', 'qualifier': 'films', 'type': 'string' },
            { 'attribute': 'director', 'qualifier': 'films', 'type': 'string' },
        ],
        [
            { 'films.fid': 1, 'films.film_name': 'Drive', 'films.director': 'Mike Leigh' },
            { 'films.fid': 8, 'films.film_name': 'Brooklyn', 'films.director': 'Akira Kurowasa' },
            { 'films.fid': 9, 'films.film_name': 'Armageddon', 'films.director': 'Richard Linklater' },
        ]
    );

    this.expectError(function() { 
        this.difference(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Difference cannot be performed due to incompatible arity.');
};

// REQ-ID: ENGINE_8
// TEST-ID: 46
EngineTest.prototype.it_can_produce_the_cartesian_product_of_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'movie_id', 'qualifier': 'favorites', 'type': 'number' },
            { 'attribute': 'rating', 'qualifier': 'favorites', 'type': 'number' },
        ],
        [
            { 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'favorites.movie_id': 4, 'favorites.rating': 5 },
        ]
    );
    var actual = this.engine.cartesianProduct(this.engine.dataSet.movies, relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'movie_id', 'qualifier': 'favorites', 'type': 'number' },
            { 'attribute': 'rating', 'qualifier': 'favorites', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'favorites.movie_id': 4, 'favorites.rating': 5 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'movies.id': 2, 'movies.title': 'Brooklyn', 'movies.year': 2015, 'favorites.movie_id': 4, 'favorites.rating': 5 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'movies.id': 3, 'movies.title': 'Gladiator', 'movies.year': 2000, 'favorites.movie_id': 4, 'favorites.rating': 5 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'favorites.movie_id': 4, 'favorites.rating': 5 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'favorites.movie_id': 1, 'favorites.rating': 7 },
            { 'movies.id': 5, 'movies.title': 'Ratatoullie', 'movies.year': 2007, 'favorites.movie_id': 4, 'favorites.rating': 5 },
        ]
    );

    this.assertEqual(expected, actual);
};

// REQ-ID: ENGINE_8
// TEST-ID: 47
EngineTest.prototype.it_throws_an_error_for_cartesian_product_if_the_relations_have_duplicate_attributes = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'rating', 'qualifier': 'movies', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.rating': 7 },
            { 'movies.id': 4, 'movies.rating': 5 },
        ]
    );

    this.expectError(function() { 
        this.cartesianProduct(this.dataSet.movies, relation2);
    }.bind(this.engine), 'Cartesian product would produce ambiguous attribute names.');
};

// REQ-ID: ENGINE_9
// TEST-ID: 48
EngineTest.prototype.it_can_produce_the_natural_join_of_two_relations = function() {
    var relation2 = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'films', 'type': 'number' },
            { 'attribute': 'rating', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'films.id': 1, 'films.rating': 7 },
            { 'films.id': 4, 'films.rating': 5 },
        ]
    );
    var actual = this.engine.naturalJoin(this.engine.dataSet.movies, relation2);
    var expected = new Relation(
        [
            { 'attribute': 'id', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'title', 'qualifier': 'movies', 'type': 'string' },
            { 'attribute': 'year', 'qualifier': 'movies', 'type': 'number' },
            { 'attribute': 'rating', 'qualifier': 'films', 'type': 'number' },
        ],
        [
            { 'movies.id': 1, 'movies.title': 'Drive', 'movies.year': 2007, 'films.rating': 7 },
            { 'movies.id': 4, 'movies.title': 'Armageddon', 'movies.year': 1998, 'films.rating': 5 },
        ]
    );

    this.assertEqual(expected, actual);
};