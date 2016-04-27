import Ast from '../language/Ast';
import Token from '../language/Token';
import { Relation } from './Relation';

export var Engine = function(dataSet) {
    this.dataSet = dataSet;
};

/**
 * Attempts to find the relation with the given name in the data set.
 * @param  {string} relationName
 * @return {object}              Relation in the data set.
 * @throws {Error} If relation with the given name does not exist.
 */
Engine.prototype.lookup = function(relationName) {
    var relation = this.dataSet[relationName];
    if (relation)
        return relation;
    else
        // TODO: More verbose error handling
        throw Error(`Relation ${relationName} does not exist.`);
};

/**
 * Performs a projection on the given relation.
 * @param  {Relation} relation   
 * @param  {array}    projection List of attributes to project.
 * @return {object}              New projected relation.
 */
Engine.prototype.project = function(relation, projection) {
    var resolved = projection.map(projection => {
        return resolveAttribute(projection, relation.attributes);
    });
    return relation.projection(resolved);
};

/**
 * Performs a selection on the given relation.
 * @param  {Relation} relation  
 * @param  {object}   predicate Predicate tree containing comparisons.
 * @return {object}             New relation after selection.
 */
Engine.prototype.select = function(relation, predicate) {
    var resolved = resolvePredicate(predicate, relation.attributes);
    return relation.selection(resolved);
};

/**
 * Performs a rename on the given relation.
 * @param  {Relation} relation   
 * @param  {string}   name       Default qualifying name of new relation.
 * @param  {object}   attributes Attribute names of new relation.
 * @return {Relation}            New relation after rename.
 * @throws {Error} If number of attributes is incorrect.
 * @throws {Error} If attributes list contains duplicates.
 * @throws {Error} If rename would be ambiguous.
 */
Engine.prototype.rename = function(relation, name, attributes) {
    if (attributes.length > 0 && attributes.length !== relation.attributes.length)
        // TODO: More verbose error handling
        throw Error(`Rename to ${name} requires ${relation.attributes.length} attributes.`);

    if (hasDuplicates(attributes, true, name))
        // TODO: More verbose error handling
        throw Error(`Rename to ${name} contains duplicate attribute names.`);

    if (hasDuplicates(relation.attributes, false) && attributes.length < 1)
        // TODO: More verbose error handling
        throw Error(`Rename to ${name} would be ambiguous.`);

    var bindings = {};
    var _old, _new, i;
    if (attributes.length > 0) {
        for (i = 0; i < relation.attributes.length; i++) {
            _old = relation.attributes[i];
            _new = attributes[i];
            bindings[_old.qualifier + '.' + _old.attribute] = { 
                attribute: _new.attribute,
                qualifier: (_new.qualifier) ? _new.qualifier : name
            };
        }
    } else {
        for (i = 0; i < relation.attributes.length; i++) {
            _old = relation.attributes[i];
            bindings[_old.qualifier + '.' + _old.attribute] = {
                attribute: _old.attribute,
                qualifier: name
            };
        }
    }
    return relation.rename(bindings);
};

Engine.prototype.union = function(x, y) {
    if (!hasSameArity(x.attributes, y.attributes))
        // TODO: More verbose error handling
        throw Error(`Union cannot be performed due to incompatible arity.`);

    return x.union(y); 
};

Engine.prototype.intersection = function(x, y) {
    if (!hasSameArity(x.attributes, y.attributes))
        // TODO: More verbose error handling
        throw Error(`Intersection cannot be performed due to incompatible arity.`);

    return x.intersection(y); 
};

Engine.prototype.difference = function(x, y) {
    if (!hasSameArity(x.attributes, y.attributes))
        // TODO: More verbose error handling
        throw Error(`Difference cannot be performed due to incompatible arity.`);

    return x.difference(y); 
};

Engine.prototype.cartesianProduct = function(x, y) {
    var allAttributes = x.attributes.concat(y.attributes);
    if (hasDuplicates(allAttributes, true))
        // TODO: More verbose error handling
        throw Error(`Cartesian product would produce ambiguous attribute names.`);

    return x.cartesianProduct(y);
};

Engine.prototype.naturalJoin = function(x, y) {
    return x.naturalJoin(y);
};

/**
 * Returns all matches for an attribute in the attribute list.
 * If qualified is true, then the attribute's name and qualifier
 * must both match.
 * @param  {object}        attribute     Attribute to match.
 * @param  {array<object>} attributeList List of attributes to match against.
 * @param  {boolean}       qualified     Whether the qualifier must match.
 * @return {array<object>}               Array of matches.
 */
function matchAttribute(attribute, attributeList, qualified) {
    var match;
    if (qualified) {
        match = attributeList.filter(attr => {
            if (attribute.qualifier === attr.qualifier &&
                attribute.attribute === attr.attribute)
                return attr;
        });
    } else {
        match = attributeList.filter(attr => {
            if (attribute.attribute === attr.attribute)
                return attr;
        });
    }
    return match;
}

/**
 * Attempts to resolve the given attribute to a single fully
 * qualified attribute within the attribute list.
 * @param  {object}        attribute     Attribute to resolve.
 * @param  {array<object>} attributeList List of fully qualified attributes.
 * @return {object}                      Fully qualified attribute.
 * @throws {Error} If attribute does not exist.
 * @throws {Error} If attribute is unqualified and ambiguous.
 */
 function resolveAttribute(attribute, attributeList) {
    var matches = null;
    if (attribute.qualifier) {
        matches = matchAttribute(attribute, attributeList, true);
        if (matches.length > 0)
            return matches[0];
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.qualifier}.${attribute.attribute} does not exist.`);
    } else {
        matches = matchAttribute(attribute, attributeList, false);
        if (matches.length > 1)
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} is ambiguous.`);
        else if (matches.length === 1)
            return matches[0];
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} does not exist.`);
    }
}

/**
 * Attempts to resolve all of the attributes within the given predicate
 * tree to a fully qualified attribute within the attribute list, and 
 * ensure that the compared types match.
 * @param  {object}        tree          Predicate.
 * @param  {array<object>} attributeList List of fully qualified attributes.
 * @return {object}                      New tree with fully qualified attributes.
 * @throws {Error} If two compared attributes in the tree have mismatching types.
 */
 function resolvePredicate(tree, attributeList) {
    var lhs, rhs;

    if (typeof tree.lhs === 'object') {
        if (tree.lhs.attribute)
            lhs = resolveAttribute(tree.lhs, attributeList);
        else
            lhs = resolvePredicate(tree.lhs, attributeList);
    } else 
        lhs = tree.lhs; 

    if (typeof tree.rhs === 'object') {
        if (tree.rhs.attribute)
            rhs = resolveAttribute(tree.rhs, attributeList);
        else
            rhs = resolvePredicate(tree.rhs, attributeList);
    } else
        rhs = tree.rhs;

    switch (tree.op) {
        case '==': case '!=': case '>': case '>=': case '<': case '<=':
            if (!hasSameType(lhs, rhs)) {
                // TODO: More verbose error handling
                throw Error(
                    `${lhs.type ? lhs.qualifier+'.'+lhs.attribute+' of type '+lhs.type : lhs+' of type '+(typeof lhs)}` +
                    ' cannot be compared with ' + 
                    `${rhs.type ? rhs.qualifier+'.'+rhs.attribute+' of type '+rhs.type : rhs+' of type '+(typeof rhs)}.`
                );
            }
            break;
    }

    return { lhs: lhs, rhs: rhs, op: tree.op };
}

/**
 * Tests whether x and y have matching types.
 * @param  {object|string|number} x 
 * @param  {object|string|number} y 
 * @return {boolean}               
 */ 
 function hasSameType(x, y) {
    var xType = (x.type) ? x.type : typeof x;
    var yType = (y.type) ? y.type : typeof y;
    return xType === yType;
}

/**
 * Checks to see if any of the given attributes have duplicates. 
 * Qualifiers are used if qualified is true. If the attribute does 
 * not have a qualifier, then qualifier will be used.
 * @param  {array<object>} bindings  Qualified or unqualified attributes.
 * @param  {boolean}       qualified Default qualifier.
 * @param  {string}        qualifier Default qualifier.
 * @return {boolean}          
 */
function hasDuplicates(attributes, qualified, qualifier) {
    var q = attributes.map(attr => {
        var str = '';
        if (qualified) {
            str = (attr.qualifier) ? attr.qualifier : qualifier;
            str += '.';
        }
        return str + attr.attribute;
    });
    q = q.sort();
    for (var i = 1; i < q.length; i++) {
        if (q[i] === q[i-1])
            return true;
    }
    return false;
}

/**
 * Checks to ensure that the lists of attributes x and y
 * have the same arity, meaining they have the same number
 * of attributes, and that attributes at position i in x
 * and y are of the same type.
 * @param  {array}   x Attribute list.
 * @param  {array}   y Attribute list.
 * @return {boolean}   Whether x and y have the same arity.
 */
function hasSameArity(x, y) {
    if (x.length !== y.length)
        return false;
    for (var i = 0; i < x.length; i++) {
        if (!hasSameType(x[i], y[i]))
            return false;
    }
    return true;
}





