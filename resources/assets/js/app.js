var $ = require('jquery');
import Token from './language/Token.js';
import Lexer from './language/Lexer.js';

$(function() {
    var lexer = new Lexer('t');
    console.log(lexer);
    lexer.consume();
    console.log(lexer);
});

