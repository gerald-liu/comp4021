function myAutoCompleteWidgetConstructor(){
    this._super();
    this.widget().menu("option", "items", "> :not(.cat)");
};
function renderAutoCompleteMenuItem(ul, item){
    terms = this.term.split(',');
    term = terms[terms.length - 1].trim();
    var reg_exp = new RegExp(term, 'g'); //'g': finds all occurence 
	var styled = item.value.replace(reg_exp, "<span class='match-character'>" + term + "</span>");
	return $("<li></li>").append(styled).appendTo(ul);
};
function renderAutoCompleteMenu(ul, items){
    var that = this;
    $.each(items, function(index, item){
        that._renderItemData(ul, item);
        ul.append("<li class='cat'>cat</li>");
    });
};
$.widget("custom.myautocomplete", $.ui.autocomplete, {
    _create: myAutoCompleteWidgetConstructor,
    _renderItem: renderAutoCompleteMenuItem,
    _renderMenu: renderAutoCompleteMenu
});

var input_data = [
    "actionscript",
    "applescript",
    "asp",
    "basic",
    "c",
    "c++",
    "clojure",
    "cobol",
    "coldfusion",
    "erlang",
    "fortran",
    "groovy",
    "haskell",
    "java",
    "javascript",
    "lisp",
    "perl",
    "php",
    "python",
    "ruby",
    "scala",
    "scheme"
];

function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

function onDocumentReady(){
    $("#search").myautocomplete({
        delay: 0,
        source: input_data,
    });
};

$(document).ready(onDocumentReady);