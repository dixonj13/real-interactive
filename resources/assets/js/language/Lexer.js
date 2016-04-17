import Token from './Token.js';
import { tokenTypes } from './TokenTypes.js';

class Lexer {

    /**
     * Instantiates a new Lexer with the given text at position 0, 
     * and sets the character to the first character of the text.
     * @param  {string} text The input text for the Lexer.
     * @return {null}      
     */
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.char = this.text[this.pos];
        this.ws = [' ', '\t', '\r', '\n'];
    }

    /**
     * Increments the position and sets the character to the next
     * character in the text. If consuming reaches EOF then the 
     * position is set to EOF.
     * @return {null} 
     */
    consume() {
        this.pos++;
        if (this.pos >= this.text.length)
            this.char = null;
        else 
            this.char = this.text[this.pos];
    }

    /**
     * Attempts to match char with the current character, consuming if
     * there is a match, else throwing an error.
     * @param  {string} char 
     * @return {null}      
     * @throws {Error} If char !== current character
     */
    match(char) {
        if (char === this.char)
            this.consume();
        else
            throw new Error(`Expected ${char} but found ${this.char}`);
    }

    /**
     * Consumes all white space until a character or EOF is found.
     * @return {null} 
     */
    whitespace() {
        while(this.ws.indexOf(this.char) !== -1)
            this.consume();
    }

    /**
     * Matches and consumes the next ID, returning a new ID token.
     * @return {Token} 
     */
    id() {
        var id = '';
        do {
            id += this.char;
            this.consume();
        } while (this.char !== null && /\w/.test(this.char));
        return new Token(tokenTypes.ID, id);
    }


    /**
     * Matches and consumes the next NUMBER, returning a new NUMBER token.
     * @return {Token} 
     */
    number() {
        var number = '';
        do {
            number += this.char;
            this.consume();
        } while (this.char !== null && /[0-9]/.test(this.char));

        return new Token(tokenTypes.NUMBER, number);
    }

    string() {
        var startPos = this.pos;
        var string = '';
        this.consume();
        while (this.char !== null && this.char !== '"') {
            string += this.char;
            this.consume();
        }

        if(this.char === '"')
            this.consume();
        else
            throw new Error(`String starting at position ${startPos} is not closed`);

        return new Token(tokenTypes.STRING, string);
    }

    /**
     * Finds and returns the next token in the text, or an EOF token if all
     * text has been consumed. If no valid token can be matched and error 
     * is thrown.
     * @return {Token} The next token in the text.
     * @throws {Error} If no valid token can be matched.
     */
    nextToken() {
        while (this.char !== null) {
            switch (this.char) {
                case ' ': case '\n': case '\t': case '\r':
                    this.whitespace();
                    continue;
                case '(':
                    this.consume();
                    return new Token(tokenTypes.LPAREN, null);
                case ')':
                    this.consume();
                    return new Token(tokenTypes.RPAREN, null);
                case '[':
                    this.consume();
                    return new Token(tokenTypes.LBRACK, null);
                case ']':
                    this.consume();
                    return new Token(tokenTypes.RBRACK, null);
                case '.':
                    this.consume();
                    return new Token(tokenTypes.DOT, null);
                case ',':
                    this.consume();
                    return new Token(tokenTypes.COMMA, null);
                case '"':
                    return this.string();
                case '⨝': // natural join symbol
                    this.consume();
                    return new Token(tokenTypes.NJOIN, null);
                case 'σ':
                    this.consume();
                    return new Token(tokenTypes.SELECT, null);
                case 'Π': case 'π':
                    this.consume();
                    return new Token(tokenTypes.PROJECT, null);
                case 'ρ':
                    this.consume();
                    return new Token(tokenTypes.RENAME, null);
                case '∪':
                    this.consume();
                    return new Token(tokenTypes.UNION, null);
                case '∩':
                    this.consume();
                    return new Token(tokenTypes.ISECT, null);
                case '−':
                    this.consume();
                    return new Token(tokenTypes.DIFF, null);
                case '×':
                    this.consume();
                    return new Token(tokenTypes.CPROD, null);
                case '∧':
                    this.consume();
                    return new Token(tokenTypes.AND, null);
                case '∨':
                    this.consume();
                    return new Token(tokenTypes.OR, null);
                case '¬':
                    this.consume();
                    return new Token(tokenTypes.NOT, null);
                case '-':
                    this.consume();
                    return new Token(tokenTypes.MINUS, null);
                case '!':
                    this.consume();
                    if (this.char === '=') {
                        this.consume();
                        return new Token(tokenTypes.NEQ, null);
                    }
                    return new Token(tokenTypes.NOT, null);
                case '>':
                    this.consume();
                    if (this.char === '=') {
                        this.consume();
                        return new Token(tokenTypes.GEQ, null);
                    }
                    return new Token(tokenTypes.GRTR, null);
                case '≥':
                    this.consume();
                    return new Token(tokenTypes.GEQ, null);
                case '=':
                    this.consume();
                    return new Token(tokenTypes.EQL, null);
                case '≠':
                    this.consume();
                    return new Token(tokenTypes.NEQ, null);
                case '<':
                    this.consume();
                    if (this.char === '=') {
                        this.consume();
                        return new Token(tokenTypes.LEQ, null);
                    }
                    return new Token(tokenTypes.LESS, null);
                case '≤':
                    this.consume();
                    return new Token(tokenTypes.LEQ, null);
                default:
                    if (/[1-9]/.test(this.char))
                        return this.number();
                    if (/[a-zA-Z_]/.test(this.char))
                        return this.id();
                    throw new Error(`Invalid character: ${this.char} at position ${this.pos}`);
            }
        }
        return new Token(tokenTypes.EOF, null);
    }
}

export default Lexer;