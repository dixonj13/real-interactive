var $ = require('jquery');
var d3 = require('d3');

import Lexer from '../language/Lexer';
import Parser from '../language/Parser';
import * as table from '../visualizations/table';
import { Engine } from '../query_tools/Engine';
import { Relation } from '../query_tools/Relation';
import { Visitor as EvalVisitor } from '../language/visitors/EvalVisitor';

export function init(data) {

    $('.Editor__button').click(e => {
        var input = e.currentTarget.innerHTML;
        insertText($('.Editor__input').get(0), input);
    });

    $('.Editor__input').keypress(e => {
        if (e.which === 13) {
            var input = $('.Editor__input').val();

            try {
                var lexer = new Lexer(input);
                var parser = new Parser(lexer);
                var ast = parser.parse();

                var engine = new Engine(data);
                var visitor = new EvalVisitor(engine);
                var relation = ast.visit(visitor);

                $('#errors').hide();
                $('#answer').empty();
                table.update(null, relation.qualifiedAttributes(), relation.tuples, '#answer');
                console.log(d3.select('#answer').node().getBoundingClientRect());
            } catch (error) {
                $('#errors').show();
                $('#errors').text(error.message);
            }
        }
    });

}

function insertText(input, text) {

    if (input === undefined)
        return;

    var scrollPos = input.scrollTop;
    var pos = 0;
    var range;
    var browser = ((input.selectionStart || input.selectionStart == "0") ? 
    "ff" : (document.selection ? "ie" : false ) );

    if (browser == "ie") { 
        input.focus();
        range = document.selection.createRange();
        range.moveStart("character", -input.value.length);
        pos = range.text.length;
    }
    else if (browser == "ff") 
        pos = input.selectionStart;

    var front = (input.value).substring(0, pos);  
    var back = (input.value).substring(pos, input.value.length); 
    input.value = front+text+back;
    pos = pos + text.length;

    if (browser == "ie") { 
        input.focus();
        range = document.selection.createRange();
        range.moveStart("character", -input.value.length);
        range.moveStart("character", pos);
        range.moveEnd("character", 0);
        range.select();
    }
    else if (browser == "ff") {
        input.selectionStart = pos;
        input.selectionEnd = pos;
        input.focus();
    }
    
    input.scrollTop = scrollPos;
}
