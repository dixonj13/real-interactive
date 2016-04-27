import Ast from '../Ast';
import Token from '../Token';
import Lexer from '../Lexer';
import Parser from '../Parser';
import { Engine } from '../../query_tools/Engine';
import { tokenTypes } from '../TokenTypes';

export var Visitor = function(engine) {

    this.engine = engine;

    this.visit = {

        NUMBER: function(node) {
            return Number.parseInt(node.getNodeValue());
        },

        STRING: function(node) {
            return node.getNodeValue();
        },

        MINUS: function(node) {
            return -1 * node.children[0].visit(this);
        },

        ID: function(node) {
            return node.getNodeValue();
        },

        ATTR: function(node) {
            return { 
                qualifier: node.children[0].visit(this),
                attribute: node.children[1].visit(this) 
            };
        },

        GRTR: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '>' };
        },

        GEQ: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '>=' };
        },

        EQL: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '==' };
        },

        NEQ: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '!=' };
        },

        LESS: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '<' };
        },

        LEQ: function(node) {
            var lhs = this.primitive(node.children[0]);
            var rhs = this.primitive(node.children[1]);
            return { lhs: lhs, rhs: rhs, op: '<=' };
        },

        AND: function(node) {
            return { 
                op: 'AND',
                lhs: node.children[0].visit(this),
                rhs: node.children[1].visit(this),
            };
        },

        OR: function(node) {
            return {
                op: 'OR',
                lhs: node.children[0].visit(this),
                rhs: node.children[1].visit(this),
            };
        },

        NOT: function(node) {
            return {
                op: 'NOT',
                lhs: node.children[0].visit(this),
            };
        },

        LIST: function(node) {
            return node.children.map(attr => { 
                return this.primitive(attr); 
            });
        },

        RELATION: function(node) {
            node.relation = this.engine.lookup(node.getNodeValue());
            return node.relation;
        },

        PROJECT: function(node) {
            var attributes = node.children[0].visit(this);
            var relation = node.children[1].visit(this);
            node.relation = this.engine.project(relation, attributes);
            return node.relation;
        },

        SELECT: function(node) {
            var predicate = node.children[0].visit(this);
            var relation = node.children[1].visit(this);
            node.relation = this.engine.select(relation, predicate);
            return node.relation;
        },

        RENAME: function(node) {
            var name = node.children[0].visit(this);
            var relation = null;
            var bindings = [];
            if (node.children[1].getNodeType() === tokenTypes.RELATION) {
                relation = node.children[1].visit(this);
            } else {
                bindings = node.children[1].visit(this);
                relation = node.children[2].visit(this);
            }
            node.relation = this.engine.rename(relation, name, bindings);
            return node.relation;
        },

        UNION: function(node) {
            var lhs = node.children[0].visit(this);
            var rhs = node.children[1].visit(this);
            node.relation = this.engine.union(lhs, rhs);
            return node.relation;
        },

        ISECT: function(node) {
            var lhs = node.children[0].visit(this);
            var rhs = node.children[1].visit(this);
            node.relation = this.engine.intersection(lhs, rhs);
            return node.relation;
        },

        DIFF: function(node) {
            var lhs = node.children[0].visit(this);
            var rhs = node.children[1].visit(this);
            node.relation = this.engine.difference(lhs, rhs);
            return node.relation;
        },

        CPROD: function(node) {
            var lhs = node.children[0].visit(this);
            var rhs = node.children[1].visit(this);
            node.relation = this.engine.cartesianProduct(lhs, rhs);
            return node.relation;
        },

        NJOIN: function(node) {
            var lhs = node.children[0].visit(this);
            var rhs = node.children[1].visit(this);
            node.relation = this.engine.naturalJoin(lhs, rhs);
            return node.relation;
        },

    };
};

Visitor.prototype.primitive = function(node) {
    if (node.getNodeType() === tokenTypes.ID) 
        return { qualifier: null, attribute: node.visit(this) };
    else
        return node.visit(this);
};
