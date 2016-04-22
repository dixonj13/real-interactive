
export var Relation = function(attributes, tuples) {
    this.attributes = attributes;
    this.tuples = tuples;
};

Relation.prototype.projection = function(attributes) {
    var tuples = this.tuples.map(tuple => {
        var matches = {};
        attributes.forEach(key => {
            var attribute = qualify(key);
            matches[attribute] = tuple[attribute];
        });
        return matches;
    });
    return new Relation(attributes, tuples);
};

Relation.prototype.selection = function(predicate) {
    var tuples = this.tuples.filter(tuple => {
        return evaluate(predicate, tuple);
    });
    return new Relation(this.attributes, tuples);
};

function evaluate(predicate, tuple) {
    var lhs, rhs;
    switch (predicate.op) {
        case '==': case '!=': case '>': case '>=': case '<': case '<=':
            return compare(predicate, tuple);
        case 'AND':
            lhs = evaluate(predicate.lhs, tuple);
            rhs = evaluate(predicate.rhs, tuple);
            return lhs && rhs;
        case 'OR':
            lhs = evaluate(predicate.lhs, tuple);
            rhs = evaluate(predicate.rhs, tuple);
            return lhs || rhs;
        case 'NOT':
            return !(evaluate(predicate.lhs, tuple));
        default:
            // TODO: More verbose error handling
            throw Error('Ill-formed predicate');
    }
}

function compare(stmt, tuple) {
    var lhs = (stmt.lhs.attribute) ? tuple[qualify(stmt.lhs)] : stmt.lhs;
    var rhs = (stmt.rhs.attribute) ? tuple[qualify(stmt.rhs)] : stmt.rhs;
    switch (stmt.op) {
        case '==': return lhs === rhs;
        case '!=': return lhs !== rhs;
        case '>' : return lhs > rhs;
        case '>=': return lhs >= rhs;
        case '<' : return lhs < rhs;
        case '<=': return lhs <= rhs;
        default:
            // TODO: More verbose error handling
            throw Error('Invalid comparison operation');
    }
}

function qualify(attribute) {
    return attribute.qualifier + '.' + attribute.attribute;
}


