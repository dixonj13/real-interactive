
class Token {

    /**
     * Creates a new token with the given type and value.
     * @param  {string} type  The type of the token.
     * @param  {string} value The value of the token.
     * @return {null}       
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    /**
     * Returns the string representation of the token.
     * E.g. <2, 'foo'>
     * @return {string} 
     */
    toString() {
        return `<${this.type}, ${this.value}>`;
    }
}

export default Token;