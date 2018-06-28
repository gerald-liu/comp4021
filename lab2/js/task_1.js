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

function onDocumentReady() {
    function autocompleteItemSelectedHandler(event, ui) {};
    
    $("#search").autocomplete({
        source: input_data,
        select: autocompleteItemSelectedHandler
    });
};

$(document).ready(onDocumentReady);