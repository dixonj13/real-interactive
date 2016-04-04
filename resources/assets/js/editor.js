
function getRangeObject(selection) {
    if (selection.getRangeAt)
        return selection.getRangeAt(0);

    var range = document.createRange();
    range.setStart(selection.anchorNode, selection.anchorOffset);
    range.setEnd(selection.focusNode, selection.focusOffset);
    return range;
}

function getCurrentSelection() {
    var selection;
    if (window.getSelection)
        selection = window.getSelection();
    else if (document.selection) 
        selection = document.selection.createRange();
    return selection;
}

function getCaretCharacterOffsetWithin(element) {
    var selection = getCurrentSelection();
    var target = document.createTextNode("\u0001");
    getRangeObject(selection).insertNode(target);
    var position = element.innerHTML.indexOf("\u0001");
    target.parentNode.removeChild(target);
    return position;
}

function HtmlEncode(s) {
  switch (s) {
    case ' ': return '\u00A0';
    default: return s;
  }
}

function isOperator(node) {
    return node.getAttribute('op') !== null;
}

function track(element, event) {
    var selection = getCurrentSelection();
    var range = getRangeObject(selection);
    var parent = selection.anchorNode.parentNode;
    var position = getCaretCharacterOffsetWithin(element);
    var char = document.createTextNode(HtmlEncode(String.fromCharCode(event.which)));
    console.log(String.fromCharCode(event.which));

    if (isOperator(parent)) {
        event.preventDefault();
        var sibling;

        if ( ! parent.nextSibling) {
            sibling = document.createElement("SPAN");
            sibling.innerHTML = HtmlEncode(String.fromCharCode(event.which));
            parent.parentNode.appendChild(sibling);
        } else {
            sibling = parent.nextSibling;
            sibling.innerHTML = HtmlEncode(String.fromCharCode(event.which)) + sibling.innerHTML;
        }

        range.setStart(sibling.firstChild, 1);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$(function() {
    $('#Editor').keypress(function(event) {
        track(this, event);
    });

    $('#Editor').on('paste', function(event) {
        event.preventDefault();

        var data = event.originalEvent.clipboardData.getData('Text');
        console.log(data.toString());
    });
});