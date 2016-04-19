import Ast from './language/Ast';
import Token from './language/Token';
import * as ops from './operations';

export var Engine = function(dataSet) {
    this.dataSet = dataSet;
};

Engine.prototype.lookup = function(relationName) {
    var relation = this.dataSet[relationName];
    if (relation)
        return relation;
    else
        // TODO: More verbose error handling
        throw Error(`Relation ${relationName} does not exist.`);
};

Engine.prototype.matchAttribute = function(attribute, attributeList, qualified) {
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
};

Engine.prototype.resolveAttribute = function(attribute, attributeList) {
    var matches = null;
    if (attribute.qualifier) {
        matches = this.matchAttribute(attribute, attributeList, true);
        if (matches.length > 0)
            return matches[0];
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.qualifier}.${attribute.attribute} does not exist.`);
    } else {
        matches = this.matchAttribute(attribute, attributeList, false);
        if (matches.length > 1)
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} is ambiguous.`);
        else if (matches.length === 1)
            return matches[0];
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} does not exist.`);
    }
};

Engine.prototype.resolvePredicate = function(tree, attributeList) {
    var lhs, rhs;

    if (typeof tree.lhs === 'object') {
        if (tree.lhs.attribute)
            lhs = this.resolveAttribute(tree.lhs, attributeList);
        else
            lhs = this.resolvePredicate(tree.lhs, attributeList);
    } else 
        lhs = tree.lhs; 

    if (typeof tree.rhs === 'object') {
        if (tree.rhs.attribute)
            rhs = this.resolveAttribute(tree.rhs, attributeList);
        else
            rhs = this.resolvePredicate(tree.rhs, attributeList);
    } else
        rhs = tree.rhs;

    switch (tree.op) {
        case '==': case '!=': case '>': case '>=': case '<': case '<=':
            if (!this.compareTypes(lhs, rhs)) {
                // TODO: More verbose error handling
                throw Error(
                    `${lhs.type ? lhs.qualifier+'.'+lhs.attribute+' of type '+lhs.type : lhs+' of type '+(typeof lhs)}` +
                    ' cannot be compared with ' + 
                    `${rhs.type ? rhs.qualifier+'.'+rhs.attribute+' of type '+rhs.type : rhs+' of type '+(typeof rhs)}`
                );
            }
            break;
    }

    return { lhs: lhs, rhs: rhs, op: tree.op };
};

Engine.prototype.compareTypes = function(x, y) {
    var xType = (x.type) ? x.type : typeof x;
    var yType = (y.type) ? y.type : typeof y;
    return xType === yType;
};

Engine.prototype.project = function(relation, projection) {
    var resolved = projection.map(projection => {
        return this.resolveAttribute(projection, relation.attributes);
    });
    return ops.projection(resolved, relation);
};

Engine.prototype.select = function(relation, predicate) {
    var resolved = this.resolvePredicate(predicate, relation.attributes);
    return ops.selection(resolved, relation);
};







