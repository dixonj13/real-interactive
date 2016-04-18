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

Engine.prototype.attributes = function(relation) {
    var attributes = [];
    if (relation.length > 0) 
        attributes = Object.keys(relation[0]);
    return attributes.map(attr => {
        var split = attr.split('.');
        return { qualifier: split[0], attribute: split[1] };
    });
};

Engine.prototype.matchAttribute = function(attribute, attributes, qualified) {
    var match;
    if (qualified) {
        match = attributes.filter(attr => {
            if (attribute.qualifier === attr.qualifier &&
                attribute.attribute === attr.attribute)
                return attr;
        });
    } else {
        match = attributes.filter(attr => {
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
            return matches[0].qualifier + '.' + matches[0].attribute;
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.qualifier}.${attribute.attribute} does not exist.`);
    } else {
        matches = this.matchAttribute(attribute, attributeList, false);
        if (matches.length > 1)
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} is ambiguous.`);
        else if (matches.length === 1)
            return matches[0].qualifier + '.' + matches[0].attribute;
        else
            // TODO: More verbose error handling
            throw Error(`${attribute.attribute} does not exist.`);
    }
};

Engine.prototype.resolvePredicate = function(tree, attributeList) {
    if (typeof tree.lhs === 'object') {
        if (tree.lhs.attribute)
            tree.lhs = this.resolveAttribute(tree.lhs, attributeList);
        else
            this.resolvePredicate(tree.lhs, attributeList);
    }
    if (typeof tree.rhs === 'object') {
        if (tree.rhs.attribute)
            tree.rhs = this.resolveAttribute(tree.rhs, attributeList);
        else
            this.resolvePredicate(tree.rhs, attributeList);
    }
};

Engine.prototype.project = function(relation, projections) {
    var attributes = this.attributes(relation);
    var resolved = projections.map(projection => {
        return this.resolveAttribute(projection, attributes);
    });
    return ops.projection(resolved, relation);
};

Engine.prototype.select = function(relation, predicate) {
    var attributes = this.attributes(relation);
    console.log(predicate);
    this.resolvePredicate(predicate, attributes);
    console.log(predicate);
};







