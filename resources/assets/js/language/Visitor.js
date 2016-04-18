import Ast from './Ast';
import Token from './Token';
import Lexer from './Lexer';
import Parser from './Parser';
import { Engine } from '../engine';
import { tokenTypes } from './TokenTypes';

export var Visitor = function(engine) {

    this.engine = engine;

    this.visit = {

        RELATION: function(node) {
            node.relation = this.engine.lookup(node.getNodeValue());
            return node.relation;
        },

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
                stmt: node.children[0].visit(this),
            };
        },

        LIST: function(node) {
            return node.children.map(attr => { 
                return this.primitive(attr); 
            });
        },

        PROJECT: function(node) {
            var attributes = node.children[0].visit(this);
            var relation = node.children[1].visit(this);
            node.relation = this.engine.project(relation, attributes);
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
