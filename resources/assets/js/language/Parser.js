import Token from './Token.js';
import Lexer from './Lexer.js';
import Ast from './Ast.js';
import { tokenTypes } from './TokenTypes.js';

class Parser {

    /**
     * Creates a new parser with the given lexer, with the lookahead
     * token set to the first token of the lexer's text input.
     * @param  {Lexer} lexer 
     * @return {null}       
     */
    constructor(lexer) {
        this.lexer = lexer;
        this.lookahead = undefined;
        this.consume();
    }

    /**
     * Sets the lookahead token to the next token in the lexer's text.
     * @return {null} 
     */
    consume() {
        this.lookahead = this.lexer.nextToken(); 
    }

    /**
     * Attempts to match the given token type to the current lookahead
     * token's type, consuming if there is a match, else throwing
     * an error.
     * @param  {string} type The string representing the token type.
     * @return {null}      
     * @throws {Error} If the token types do not match.
     */
    match(type) {
        if (this.lookahead.type === type)
            this.consume();
        else {
            throw new Error(`Type mismatch; Expecting ${type} but found ${this.lookahead.type}`);
        }
    }

    /**
     * Parses a positive or negative number.
     * @return {Ast} 
     */
    number() {
        var node, token;
        if (this.lookahead.type === tokenTypes.MINUS) {
            this.match(tokenTypes.MINUS);
            node = new Ast(tokenTypes.MINUS);
            token = this.lookahead;
            this.match(tokenTypes.NUMBER);
            node.addChild(new Ast(token));
        } else {
            token = this.lookahead;
            this.match(tokenTypes.NUMBER);
            node = new Ast(token);
        }

        return node;
    }

    /**
     * Parses an attribute which can be a single value
     * or a qualifier and a value separated by a dot.
     * @return {Ast}
     */
    attribute() {
        var node;
        var token = this.lookahead;
        this.match(tokenTypes.ID);
        node = new Ast(token);
        if (this.lookahead.type === tokenTypes.DOT) {
            this.match(tokenTypes.DOT);
            token = this.lookahead;
            this.match(tokenTypes.ID);
            var parent = new Ast(tokenTypes.ATTR);
            parent.addChild(node);
            parent.addChild(new Ast(token));
            node = parent;
        }
        return node;
    }

    /**
     * Parses a list of comma separated attributes.
     * @return {Ast} 
     */
    attributes() {
        var node = new Ast(tokenTypes.LIST);
        node.addChild(this.attribute());
        while (this.lookahead.type === tokenTypes.COMMA) {
            this.match(tokenTypes.COMMA);
            node.addChild(this.attribute());
        }
        return node;
    }

    /**
     * Parses a string surrounded by double parenthesis.
     * @return {Ast} 
     */
    string() {
        var token = this.lookahead;
        this.match(tokenTypes.STRING);
        return new Ast(token);
    }

    /**
     * Parses a comparable value, which can be an attribute,
     * number, or string.
     * @return {Ast}
     * @throws {Error} If lookahead is not a comparable value.
     */
    comparable() {
        if (this.lookahead.type === tokenTypes.ID)
            return this.attribute();
        if (this.lookahead.type === tokenTypes.MINUS ||
            this.lookahead.type === tokenTypes.NUMBER)
            return this.number();
        if (this.lookahead.type === tokenTypes.STRING)
            return this.string();
        throw new Error('Expected comparable value, but found ' + this.lookahead.toString());
    }

    /**
     * Parses a comparison operator.
     * @return {Ast} 
     * @throws {Error} If lookahead is not a comparison operator.
     */
    compareOp() {
        var token = this.lookahead;
        if (this.lookahead.type === tokenTypes.LESS) {
            this.match(tokenTypes.LESS);
            return new Ast(token);
        }
        if (this.lookahead.type === tokenTypes.LEQ) {
            this.match(tokenTypes.LEQ);
            return new Ast(token);
        }
        if (this.lookahead.type === tokenTypes.GRTR) {
            this.match(tokenTypes.GRTR);
            return new Ast(token);
        }
        if (this.lookahead.type === tokenTypes.GEQ) {
            this.match(tokenTypes.GEQ);
            return new Ast(token);
        }
        if (this.lookahead.type === tokenTypes.EQL) {
            this.match(tokenTypes.EQL);
            return new Ast(token);
        }
        if (this.lookahead.type === tokenTypes.NEQ) {
            this.match(tokenTypes.NEQ);
            return new Ast(token);
        }
        throw new Error('Expected comparison operator, but found ' + this.lookahead.toString());
    }

    /**
     * Parses a comparison made up of a lhs comparable value,
     * a comparison operator, and a rhs comparable value.
     * @return {Ast}
     * @throws {Error}
     */
    comparison() {
        var lhs = this.comparable();
        var compareOp = this.compareOp();
        var rhs = this.comparable();
        compareOp.addChild(lhs);
        compareOp.addChild(rhs);
        return compareOp;
    }

    /**
     * Parses the operand of a predicate, beginning with 
     * a not, left paren, or comparable value.
     * @return {Ast} 
     * @throws {Error}
     */
    operand() {
        var node;
        if (this.lookahead.type === tokenTypes.NOT) {
            node = new Ast(this.lookahead);
            this.match(tokenTypes.NOT);
            this.match(tokenTypes.LPAREN);
            var disjunction = this.disjunction();
            this.match(tokenTypes.RPAREN);
            node.addChild(disjunction);
            return node;
        }
        if (this.lookahead.type === tokenTypes.LPAREN) {
            this.match(tokenTypes.LPAREN);
            node = this.disjunction();
            this.match(tokenTypes.RPAREN);
            return node;
        }
        if (this.lookahead.type === tokenTypes.ID ||
            this.lookahead.type === tokenTypes.NUMBER ||
            this.lookahead.type === tokenTypes.STRING) {
            return this.comparison();
        }
        throw new Error(`Expected start of operand, but found ${this.lookahead.type}`);
    }

    /**
     * Parses a logical conjunction, beginning with a not, 
     * left paren, or comparable value.
     * @return {Ast} 
     * @throws {Error}
     */
    conjunction() {
        var node = this.operand();
        while (this.lookahead.type === tokenTypes.AND) {
            var parent = new Ast(this.lookahead);
            this.match(tokenTypes.AND);
            var sibling = this.operand();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    /**
     * Parses a logical disjunction, beginning with a not, 
     * left paren, or comparable value.
     * @return {Ast} 
     * @throws {Error}
     */
    disjunction() {
        var node = this.conjunction();
        while (this.lookahead.type === tokenTypes.OR) {
            var parent = new Ast(this.lookahead);
            this.match(tokenTypes.OR);
            var sibling = this.conjunction();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    /**
     * Parses a relation beginning with a projection, selection, 
     * rename left paren, or id, which can be the result of one 
     * or more operations on any number of other relations.
     * @return {Ast} 
     * @throws {Error}
     */
    relation() {
        var node;
        if (this.lookahead.type === tokenTypes.PROJECT) {
            this.match(tokenTypes.PROJECT);
            node = new Ast(tokenTypes.PROJECT);
            node.addChild(this.attributes());
            this.match(tokenTypes.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(tokenTypes.RPAREN);
            return node;
        }
        if (this.lookahead.type === tokenTypes.SELECT) {
            this.match(tokenTypes.SELECT);
            node = new Ast(tokenTypes.SELECT);
            node.addChild(this.disjunction());
            this.match(tokenTypes.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(tokenTypes.RPAREN);
            return node;
        } 
        if (this.lookahead.type === tokenTypes.RENAME) {
            this.match(tokenTypes.RENAME);
            node = new Ast(tokenTypes.RENAME);
            node.addChild(this.attribute());
            if (this.lookahead.type === tokenTypes.LBRACK) {
                this.match(tokenTypes.LBRACK);
                node.addChild(this.attributes());
                this.match(tokenTypes.RBRACK);
            }
            this.match(tokenTypes.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(tokenTypes.RPAREN);
            return node;
        }
        if (this.lookahead.type === tokenTypes.LPAREN) {
            this.match(tokenTypes.LPAREN);
            node = this.unionIntersection();
            this.match(tokenTypes.RPAREN);
            return node;
        }
        if (this.lookahead.type === tokenTypes.ID) {
            node = new Ast(this.lookahead);
            this.match(tokenTypes.ID);
            node.token.type = tokenTypes.RELATION; // differentiate relations from ids at this point
            return node;
        }
        throw new Error(`Expected start of relation but found ${this.lookahead.type}`);
    }

    /**
     * Parses the cartesian product of two relations.
     * @return {Ast} 
     * @throws {Error}
     */
    cartesianProduct() {
        var node = this.relation();
        while (this.lookahead.type === tokenTypes.CPROD) {
            var parent = new Ast(this.lookahead);
            this.match(tokenTypes.CPROD);
            var sibling = this.relation();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    /**
     * Parses the joining of two relations.
     * @return {Ast} 
     * @throws {Error}
     */
    join() {
        var node = this.cartesianProduct();
        while (this.lookahead.type === tokenTypes.NJOIN) {
            var parent = new Ast(this.lookahead);
            this.match(tokenTypes.NJOIN);
            var sibling = this.cartesianProduct();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    /**
     * Parses the difference of two relations.
     * @return {Ast} 
     * @throws {Error}
     */
    difference() {
        var node = this.join();
        while (this.lookahead.type === tokenTypes.DIFF) {
            var parent = new Ast(this.lookahead);
            this.match(tokenTypes.DIFF);
            var sibling = this.join();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    /**
     * Parses the union or intersection of two relations.
     * @return {Ast} 
     * @throws {Error}
     */
    unionIntersection() {
        var node = this.difference();
        while (this.lookahead.type === tokenTypes.UNION ||
               this.lookahead.type === tokenTypes.ISECT) {
            var parent = new Ast(this.lookahead);
            if (this.lookahead.type === tokenTypes.UNION)
                this.match(tokenTypes.UNION);
            else 
                this.match(tokenTypes.ISECT);
            var sibling = this.difference();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }
}

export default Parser;