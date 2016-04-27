var _ = require('lodash/lang');

export var Relation = function(attributes, tuples) {
    this.attributes = attributes;
    this.tuples = tuples;
};

/**
 * Creates a new copy of this relation.
 * @return {Relation} New Relation.
 */
Relation.prototype.clone = function() {
    return new Relation(_.cloneDeep(this.attributes), _.cloneDeep(this.tuples));
};

/**
 * Retrieves the attributes in the relation as an array of
 * fully qualified attribute strings.
 * @return {array<string>} 
 */
Relation.prototype.qualifiedAttributes = function() {
    return this.attributes.map(attr => {
        return attr.qualifier + '.' + attr.attribute;
    });
};

/**
 * Retrieves the attributes in the relation as an array
 * of unqualified attribute strings.
 * @return {array<string>} 
 */
Relation.prototype.unqualifiedAttributes = function() {
    return this.attributes.map(attr => {
        return attr.attribute;
    });
};

/**
 * Performs a projection operation on the relation, returning
 * a new relation with only the specified attributes.
 * @param  {array<object>} attributes Attributes to project.
 * @return {Relation}                 New Relation.
 */
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

/**
 * Performs a selection operation on the relation using the 
 * given predicate object, returning a new relation with
 * all of the current attributes.
 * @param  {object} predicate Predicate containing comparions.
 * @return {Relation}         New Relation.
 */
Relation.prototype.selection = function(predicate) {
    var tuples = this.tuples.filter(tuple => {
        return evaluate(predicate, tuple);
    });
    return new Relation(_.cloneDeep(this.attributes), tuples);
};

/**
 * Produces a new relation by renaming this relation using
 * the given attribute bindings.
 * @param  {object}   bindings
 * @return {Relation}          New Relation.
 */
Relation.prototype.rename = function(bindings) {
    var copy = this.clone();

    copy.attributes.forEach(attr => {
        var qualified = qualify(attr);
        attr.attribute = bindings[qualified].attribute;
        attr.qualifier = bindings[qualified].qualifier;
    });

    copy.tuples = copy.tuples.map(tuple => {
        var rebind = {};
        Object.keys(bindings).forEach(key => {
            var qualifier = qualify(bindings[key]);
            rebind[qualifier] = tuple[key]; 
        });
        return rebind;
    });

    return copy;
};

/**
 * Takes the union of this and another specified relation
 * to create a new relation.
 * @param  {Relation} relation Second (RHS) relation.
 * @return {Relation}          New relation.
 */
Relation.prototype.union = function(relation) {
    var x = this.clone();
    var y = relation;
    var tupleVal;
    var tupleMap = {};

    var xAttributes = x.qualifiedAttributes();
    x.tuples.forEach(tuple => {
        tupleVal = xAttributes.reduce((p, c) => { return p + tuple[c].toString(); }, '');
        tupleMap[tupleVal] = true;
    });

    var yAttributes = y.qualifiedAttributes();
    y.tuples.forEach(tuple => {
        tupleVal = yAttributes.reduce((p, c) => { return p + tuple[c].toString(); }, '');
        if (!tupleMap[tupleVal]) {
            var newTuple = {};
            xAttributes.forEach((a, i) => { newTuple[xAttributes[i]] = tuple[yAttributes[i]]; });
            x.tuples.push(newTuple);
        }
    });

    return x;
};

/**
 * Takes the intersection of this and another specified 
 * relation to create a new relation.
 * @param  {Relation} relation Second (RHS) relation.
 * @return {Relation}          New relation.
 */
Relation.prototype.intersection = function(relation) {
    var x = this.clone(); 
    var y = relation;
    var tupleVal;
    var tupleMap = {};

    var yAttributes = y.qualifiedAttributes();
    y.tuples.forEach(tuple => {
        var tupleVal = yAttributes.reduce((p, c) => {return p + tuple[c].toString(); }, '');
        tupleMap[tupleVal] = tuple;
    });

    var xAttributes = x.qualifiedAttributes();
    x.tuples = x.tuples.filter(tuple => {
        var tupleVal = xAttributes.reduce((p, c) => { return p + tuple[c].toString(); }, '');
        if (tupleMap[tupleVal]) return true;
    });

    return x;
};

/**
 * Takes the difference of this and another specified relation
 * to create a new relation.
 * @param  {Relation} relation Second (RHS) relation.
 * @return {Relation}          New relation.
 */
Relation.prototype.difference = function(relation) {
    var x = this.clone();
    var y = relation;
    var tupleVal;
    var tupleMap = {};

    var yAttributes = y.qualifiedAttributes();
    y.tuples.forEach(tuple => {
        var tupleVal = yAttributes.reduce((p, c) => {return p + tuple[c].toString(); }, '');
        tupleMap[tupleVal] = tuple;
    });

    var xAttributes = x.qualifiedAttributes();
    x.tuples = x.tuples.filter(tuple => {
        var tupleVal = xAttributes.reduce((p, c) => { return p + tuple[c].toString(); }, '');
        if (!tupleMap[tupleVal]) return true;
    });

    return x;
};

/**
 * Takes the cartesian product of this and another specified 
 * relation to create a new relation.
 * @param  {Relation} relation Second (RHS) relation.
 * @return {Relation}          New relation.
 */
Relation.prototype.cartesianProduct = function(relation) {
    var x = this;
    var y = relation;

    var tuples = [];
    x.tuples.forEach(xTuple => {
        y.tuples.forEach(yTuple => {
            var newTuple = {};
            Object.keys(xTuple).forEach(k => { newTuple[k] = xTuple[k]; });
            Object.keys(yTuple).forEach(k => { newTuple[k] = yTuple[k]; });
            tuples.push(newTuple);
        });
    });

    return new Relation(
        _.cloneDeep(x.attributes).concat(_.cloneDeep(y.attributes)),
        tuples
    );
};

/**
 * Natural joins this and another relation on any
 * common attributes to create a new relation.
 * @param  {Relation} relation Second (RHS) relation.
 * @return {Relation}          New Relation.
 */
Relation.prototype.naturalJoin = function(relation) {
    var x = this;
    var y = relation;
    var bindings = {};
    var yBound = {};

    x.attributes.forEach(xAttr => {
        var m = y.attributes
            .filter(yAttr => { 
                if (yAttr.attribute === xAttr.attribute) {
                    yBound[qualify(yAttr)] = true;
                    return true;
                }
            })
            .map(yAttr => { return qualify(yAttr); });
        if (m.length > 0)
            bindings[qualify(xAttr)] = m;
    });

    var yUnbound = y.attributes
        .filter(yAttr => { return !yBound[qualify(yAttr)]; });

    var tuples = [];
    x.tuples.forEach(xTuple => {
        y.tuples.forEach(yTuple => {
            var join = Object.keys(bindings).reduce((prev, binding) => {
                return prev && bindings[binding].reduce((prev, bound) => {
                    return prev && yTuple[bound] === xTuple[binding];
                }, true);
            }, true);

            if (join) {
                var newTuple = _.cloneDeep(xTuple);
                yUnbound.forEach(yAttr => { 
                    var qualified = qualify(yAttr);
                    newTuple[qualified] = yTuple[qualified]; 
                });
                tuples.push(newTuple);
            }
        });
    });

    return new Relation(
        _.cloneDeep(x.attributes).concat(_.cloneDeep(yUnbound)),
        tuples
    );
};

/**
 * Evaluates a tuple to see if the given predicate holds.
 * @param  {object}  predicate Comparisons for testing the tuple.
 * @param  {object}  tuple     Tuple to be tested.
 * @return {boolean}           
 */
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

/**
 * Returns whether or not the comparison statement holds.
 * If a tuple is being tested, then the comparison will be
 * tested on the given tuple.
 * @param  {object}  stmt  Comparison statement.
 * @param  {object}  tuple Optional tuple to be tested.
 * @return {boolean}       
 */
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

/**
 * Returns the fully qualified string representation
 * of the given attribute.
 * @param  {object} attribute Attribute to be converted.
 * @return {string}           Fully qualified string representation.
 */
function qualify(attribute) {
    return attribute.qualifier + '.' + attribute.attribute;
}


