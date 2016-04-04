import Token from './Token.js';

class Ast {

    /**
     * An Ast can be constructed with with no token to create
     * a null node, with an instance of a Token, or with a string
     * as the type of the Token. If token is a string denoting the
     * token type, then the Token's value will be set to value
     * @param  {Token|string|null} token The node's Token or token type.
     * @param  {string|null}       value The node's token value.
     * @return {null}
     */
    constructor(token = null, value = null) {
        this.children = null;
        if(token instanceof Token)
            this.token = token;
        else
            this.token = new Token(token, value);
    }

    /**
     * Gets the type of the node's token.
     * @return {string}
     */
    getNodeType() {
        return this.token.type;
    }

    /**
     * Gets the value of the node's token.
     * @return {string} 
     */
    getNodeValue() {
        return this.token.value;
    }

    /**
     * A node is a leaf when it has no children.
     * @return {Boolean} True when the node is a leaf.
     */
    isLeaf() {
        return this.children === null || this.children.length === 0;
    }

    /**
     * A node is null when it's token type is null.
     * @return {Boolean} True when the node is null.
     */
    isNull() {
        return this.getNodeType() === null;
    }

    /**
     * Adds a child node to this node.
     * @param {Ast} child
     */
    addChild(child) {
        if (this.children === null)
            this.children = [];
        this.children.push(child);
    }

    /**
     * The representation of this node as its token.
     * @return {[type]} [description]
     */
    toString() {
        return (this.isNull()) ? '<null>' : this.token.toString();
    }

    /**
     * The string representation of this node. A null node's is
     * represented by <null>. A leaf is represented by the node's
     * token's value. A nonleaf is represented by a node's token's
     * type.
     * @return {string} 
     */
    toNodeString() {
        if (this.isNull())
            return '<null>';
        else if (this.isLeaf())
            return '<' + this.token.value + '>';
        else 
            return '<' + this.token.type + '>';
    }

    /**
     * The string representation of the Ast where this node is the root.
     * @return {string} 
     */
    toTreeString() {
        if (this.isLeaf()) 
            return this.toNodeString();
        var tree = '';
        if (!this.isNull())
            tree += '(' + this.toNodeString() + ' ';
        this.children.forEach(function (item, index, array) {
            tree += item.toTreeString();
            tree += (index < array.length - 1) ? ' ' : '';
        });
        if (!this.isNull())
            tree += ')';
        return tree;
    }
}

export default Ast;