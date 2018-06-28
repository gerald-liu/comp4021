function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

function keydownHandler(event){
    if ((event.keyCode === $.ui.keyCode.TAB || event.keyCode === $.ui.keyCode.ENTER)
        && $(this).myautocomplete("instance").menu.active) 
        event.preventDefault(); // don't navigate away from the field
};
    
function autocompleteSourceHandler(request, response){
    response($.ui.autocomplete.filter(input_data, extractLast(request.term)));
};

function autocompleteItemFocusedHandler(event, ui){
    return false; // prevent value inserted on focus
};

function autocompleteItemSelectedHandler(event, ui){
    var terms = split(this.value);
    terms.pop();
    terms.push(ui.item.value); 
    terms.push("");
    this.value = terms.join(", ");
    return false;
};

function myAutoCompleteWidgetConstructor(){
    this._super();
    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
};

function renderAutoCompleteMenuItem(ul, item){
    terms = this.term.split(',');
    term = terms[terms.length - 1].trim();
    var reg_exp = new RegExp(term, 'g');
	var styled = item.value.replace(reg_exp, "<span class='match-character'>" + term + "</span>");
	return $("<li></li>").append(styled).appendTo(ul);
};

function renderAutoCompleteMenu(ul, items){
    var that = this;
    var currCategory = "";
    $.each(items, function(index, item){
        if (item.category != currCategory) {
            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
            currCategory = item.category;
        }
        var li = that._renderItemData(ul, item);
        if (item.category)
            li.attr("aria-label", item.category + " : " + item.label);
    });
};

$.widget("custom.myautocomplete", $.ui.autocomplete, {
    _create: myAutoCompleteWidgetConstructor,
    _renderItem: renderAutoCompleteMenuItem,
    _renderMenu: renderAutoCompleteMenu
});

var input_data = [
    { label: "anders", category: "General" },
    { label: "andreas", category: "General" },
    { label: "antal", category: "General" },
    { label: "barders", category: "General" },
    { label: "bardreas", category: "General" },
    { label: "bartal", category: "General" },
    { label: "annhhx10", category: "Products" },
    { label: "annk K12", category: "Products" },
    { label: "annttop C13", category: "Products" },
    { label: "barnhhx10", category: "Products" },
    { label: "barnk K12", category: "Products" },
    { label: "barnttop C13", category: "Products" },
    { label: "anders andersson", category: "People" },
    { label: "andreas andersson", category: "People" },
    { label: "andreas johnson", category: "People" },
    { label: "barders antal", category: "People" },
    { label: "bardreas antal", category: "People" },
    { label: "bardreas johnson", category: "People" }
];

function onDocumentReady(){
    $("#search")
        .on("keydown", keydownHandler)
        
        .myautocomplete({
            minLength: 2,
            source: autocompleteSourceHandler,
            focus: autocompleteItemFocusedHandler,
            select: autocompleteItemSelectedHandler,
            search: function () {
                var term = extractLast(this.value);
                if (term.length < 2) return false;
            }
        });
};

$(document).ready(onDocumentReady);