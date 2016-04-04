import Token from './Token.js';
import Lexer from './Lexer.js';
import Ast from './Ast.js';

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

    number() {
        var node, token;
        if (this.lookahead.type === this.lexer.types.MINUS) {
            this.match(this.lexer.types.MINUS);
            node = new Ast(this.lexer.types.MINUS);
            token = this.lookahead;
            this.match(this.lexer.types.NUMBER);
            node.addChild(new Ast(token));
        } else {
            token = this.lookahead;
            this.match(this.lexer.types.NUMBER);
            node = new Ast(token);
        }

        return node;
    }

    attribute() {
        var node;
        var token = this.lookahead;
        this.match(this.lexer.types.ID);
        node = new Ast(token);
        if (this.lookahead.type === this.lexer.types.DOT) {
            this.match(this.lexer.types.DOT);
            token = this.lookahead;
            this.match(this.lexer.types.ID);
            var parent = new Ast(this.lexer.types.ATTR);
            parent.addChild(node);
            parent.addChild(new Ast(token));
            node = parent;
        }
        return node;
    }

    attributes() {
        var node = new Ast(this.lexer.types.LIST);
        node.addChild(this.attribute());
        while (this.lookahead.type === this.lexer.types.COMMA) {
            this.match(this.lexer.types.COMMA);
            node.addChild(this.attribute());
        }
        return node;
    }

    string() {
        var token = this.lookahead;
        this.match(this.lexer.types.STRING);
        return new Ast(token);
    }

    comparable() {
        if (this.lookahead.type === this.lexer.types.ID)
            return this.attribute();
        if (this.lookahead.type === this.lexer.types.NUMBER)
            return this.number();
        if (this.lookahead.type === this.lexer.types.STRING)
            return this.string();
        throw new Error('Expected comparable value, but found ' + this.lookahead.toString());
    }

    compareOp() {
        var token = this.lookahead;
        if (this.lookahead.type === this.lexer.types.LESS) {
            this.match(this.lexer.types.LESS);
            return new Ast(token);
        }
        if (this.lookahead.type === this.lexer.types.LEQ) {
            this.match(this.lexer.types.LEQ);
            return new Ast(token);
        }
        if (this.lookahead.type === this.lexer.types.GRTR) {
            this.match(this.lexer.types.GRTR);
            return new Ast(token);
        }
        if (this.lookahead.type === this.lexer.types.GEQ) {
            this.match(this.lexer.types.GEQ);
            return new Ast(token);
        }
        if (this.lookahead.type === this.lexer.types.EQL) {
            this.match(this.lexer.types.EQL);
            return new Ast(token);
        }
        if (this.lookahead.type === this.lexer.types.NEQ) {
            this.match(this.lexer.types.NEQ);
            return new Ast(token);
        }
        throw new Error('Expected comparison operator, but found ' + this.lookahead.toString());
    }

    comparison() {
        var lhs = this.attribute();
        var compareOp = this.compareOp();
        var rhs = this.comparable();
        compareOp.addChild(lhs);
        compareOp.addChild(rhs);
        return compareOp;
    }

    operand() {
        var node;
        if (this.lookahead.type === this.lexer.types.NOT) {
            node = new Ast(this.lookahead);
            this.match(this.lexer.types.NOT);
            this.match(this.lexer.types.LPAREN);
            var disjunction = this.disjunction();
            this.match(this.lexer.types.RPAREN);
            node.addChild(disjunction);
            return node;
        }
        if (this.lookahead.type === this.lexer.types.LPAREN) {
            this.match(this.lexer.types.LPAREN);
            node = this.disjunction();
            this.match(this.lexer.types.RPAREN);
            return node;
        }
        if (this.lookahead.type === this.lexer.types.ID) {
            return this.comparison();
        }
        throw new Error(`Expected start of operand, but found ${this.lookahead.type}`);
    }

    conjunction() {
        var node = this.operand();
        while (this.lookahead.type === this.lexer.types.AND) {
            var parent = new Ast(this.lookahead);
            this.match(this.lexer.types.AND);
            var sibling = this.operand();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    disjunction() {
        var node = this.conjunction();
        while (this.lookahead.type === this.lexer.types.OR) {
            var parent = new Ast(this.lookahead);
            this.match(this.lexer.types.OR);
            var sibling = this.conjunction();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    relation() {
        var node;
        if (this.lookahead.type === this.lexer.types.PROJECT) {
            this.match(this.lexer.types.PROJECT);
            node = new Ast(this.lexer.types.PROJECT);
            node.addChild(this.attributes());
            this.match(this.lexer.types.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(this.lexer.types.RPAREN);
            return node;
        }
        if (this.lookahead.type === this.lexer.types.SELECT) {
            this.match(this.lexer.types.SELECT);
            node = new Ast(this.lexer.types.SELECT);
            node.addChild(this.disjunction());
            this.match(this.lexer.types.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(this.lexer.types.RPAREN);
            return node;
        } 
        if (this.lookahead.type === this.lexer.types.RENAME) {
            this.match(this.lexer.types.RENAME);
            node = new Ast(this.lexer.types.RENAME);
            node.addChild(this.attribute());
            if (this.lookahead.type === this.lexer.types.LBRACK) {
                this.match(this.lexer.types.LBRACK);
                node.addChild(this.attributes());
                this.match(this.lexer.types.RBRACK);
            }
            this.match(this.lexer.types.LPAREN);
            node.addChild(this.unionIntersection());
            this.match(this.lexer.types.RPAREN);
            return node;
        }
        if (this.lookahead.type === this.lexer.types.LPAREN) {
            this.match(this.lexer.types.LPAREN);
            node = this.unionIntersection();
            this.match(this.lexer.types.RPAREN);
            return node;
        }
        if (this.lookahead.type === this.lexer.types.ID) {
            node = new Ast(this.lookahead);
            this.match(this.lexer.types.ID);
            return node;
        }
        throw new Error(`Expected start of relation but found ${this.lookahead.type}`);
    }

    cartesianProduct() {
        var node = this.relation();
        while (this.lookahead.type === this.lexer.types.CPROD) {
            var parent = new Ast(this.lookahead);
            this.match(this.lexer.types.CPROD);
            var sibling = this.relation();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    join() {
        var node = this.cartesianProduct();
        while (this.lookahead.type === this.lexer.types.NJOIN) {
            var parent = new Ast(this.lookahead);
            this.match(this.lexer.types.NJOIN);
            var sibling = this.cartesianProduct();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    difference() {
        var node = this.join();
        while (this.lookahead.type === this.lexer.types.DIFF) {
            var parent = new Ast(this.lookahead);
            this.match(this.lexer.types.DIFF);
            var sibling = this.join();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }

    unionIntersection() {
        var node = this.difference();
        while (this.lookahead.type === this.lexer.types.UNION ||
               this.lookahead.type === this.lexer.types.ISECT) {
            var parent = new Ast(this.lookahead);
            if (this.lookahead.type === this.lexer.types.UNION)
                this.match(this.lexer.types.UNION);
            else 
                this.match(this.lexer.types.ISECT);
            var sibling = this.difference();
            parent.addChild(node);
            parent.addChild(sibling);
            node = parent;
        }
        return node;
    }
}

export default Parser;