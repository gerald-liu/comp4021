
// Set a cookie
function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}

// Get a cookie
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}

// Delete a cookie
function deleteCookie(name, path, domain) {
    if (get_cookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

// Score Class
var NUMBER_OF_HIGH_SCORE = 10;
var allName = new Array(10);

function Record(name, score) {
    this.name = name;
    this.score = score;
}

// Read cookies
function getHighScoreTable() {
    var table = new Array();
    for (var i = 0; i < NUMBER_OF_HIGH_SCORE; i++) {
        // Name
        var name = "player" + i;
        // Get cookies value
        var value = getCookie(name);

        if (value == null)
            break;
        // Get the name and score of the player
        var record = value.split("~");
        // Add a new score record
        table.push(new Record(record[0], parseInt(record[1])));
    }
    return table;
}

// Store the high score table to the cookies
function setHighScoreTable(table) {
    for (var i = 0; i < NUMBER_OF_HIGH_SCORE; i++) {
        if (i >= table.length) break;
        var name = 'player' + i;
        setCookie(name, table[i].name + "~" + table[i].score);
    }
}

// Add a high score entry to the table
function addHighScore(record, node) {
    var name = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
    //Set attributes
    name.setAttribute("x", 100);
    name.setAttribute("dy", 30);
    name.appendChild(svgdoc.createTextNode(record.name));
    name.style.setProperty('font-family', 'Arial', null);
    node.appendChild(name);

    var score = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
    // Set Attribute
    score.setAttribute("x", 400);
    score.style.setProperty('font-family', 'Arial', null);
    score.appendChild(svgdoc.createTextNode(record.score));
    node.appendChild(score);
}

function addNewHighScore(record, node) {
    var name = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
    //Set attributes
    name.setAttribute("x", 100);
    name.setAttribute("dy", 30);
    name.appendChild(svgdoc.createTextNode(record.name));
    name.style.setProperty('font-family', 'Arial', null);
    name.style.setProperty('fill', 'red', null);
    node.appendChild(name);

    var score = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
    // Set Attribute
    score.setAttribute("x", 400);
    score.style.setProperty('font-family', 'Arial', null);
    score.style.setProperty('fill', 'red', null);
    score.appendChild(svgdoc.createTextNode(record.score));
    node.appendChild(score);
}

// Display the highscore table
function displayHighScoreTable(table, position) {
    // Show the table
    var node = svgdoc.getElementById("highscoreTable");
    node.style.setProperty("visibility", "visible", null);
    // High score table
    var node = svgdoc.getElementById("highscoreText");

    // Clear old score
    for (var i = 0; i < node.childNodes.length; i++) {
        var oldRecord = node.childNodes.item(i);
        node.removeChild(oldRecord);
        i--;
    }

    // Show new score
    for (var i = 0; i < NUMBER_OF_HIGH_SCORE; i++) {
        if (i >= table.length) break;

        // Add the record at the end of the text node
        if (i == position)
            addNewHighScore(table[i], node);
        else
            addHighScore(table[i], node);
    }
}