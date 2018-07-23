<?php

// get the name from cookie
$name = "";
if (isset($_COOKIE["name"])) {
    $name = $_COOKIE["name"];
}

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script language="javascript" type="text/javascript">
        //<![CDATA[
        var loadTimer = null;
        var request;
        var datasize;
        var lastMsgID;

        function load() {
            var username = document.getElementById("username");
            if (username.value == "") {
                loadTimer = setTimeout("load()", 100);
                return;
            }

            loadTimer = null;
            datasize = 0;
            lastMsgID = 0;
            
            var node = document.getElementById("chatroom");
            node.style.setProperty("visibility", "visible", null);

            getUpdate();
        }

        function unload() {
            var username = document.getElementById("username");
            if (username.value != "") {
                //request = new ActiveXObject("Microsoft.XMLHTTP");
                request =new XMLHttpRequest();
                request.open("POST", "logout.php", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(null);
                username.value = "";
            }
            if (loadTimer != null) {
                loadTimer = null;
                clearTimeout("load()", 100);
            }
        }

        function getUpdate() {
            //request = new ActiveXObject("Microsoft.XMLHTTP");
            request =new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("datasize=" + datasize);
        }

        function stateChange() {
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                try {
                    xmlDoc =new XMLHttpRequest();
                    xmlDoc.loadXML(request.responseText);
                } catch (e) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                }
                datasize = request.responseText.length;
                updateChat(xmlDoc);
                getUpdate();
            }
        }

        function updateChat(xmlDoc) {
            //point to the message nodes
            var messages = xmlDoc.getElementsByTagName("message");

            // create a string for the messages
			for(var i = lastMsgID; i < messages.length; i++) {
				var message = messages.item(i);
				var content = message.innerHTML;
				var name = message.getAttribute('name');
                var color = message.getAttribute('color');

				showMessage(name, content, color);
			}

			lastMsgID = messages.length;
        }

        function showMessage(nameStr, contentStr, colorStr){
                var node = document.getElementById("chattext");
                // Create the name text span
                var nameNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

                // Set the attributes and create the text
                nameNode.setAttribute("x", 100);
                nameNode.setAttribute("dy", 20);
                nameNode.setAttribute("fill", colorStr);
                nameNode.appendChild(document.createTextNode(nameStr));

                // Add the name to the text node
                node.appendChild(nameNode);

                // Create the content text span
                var conetentNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

                // Set the attributes and create the text
                conetentNode.setAttribute("x", 200);
                conetentNode.setAttribute("fill", colorStr);
                //conetentNode.appendChild(document.createTextNode(contentStr));

                // Automatic Hyperlink
                var currIndex = 0;
                while (currIndex != -1) {
                    var nonUrlStr = null;
                    var urlStr = null;

                    var indexOfHttp = contentStr.indexOf("http://", currIndex);
                    if (indexOfHttp == -1) {
                        nonUrlStr = contentStr.substring(currIndex);
                        currIndex = -1;
                    }
                    else {
                        nonUrlStr = contentStr.substring(currIndex, indexOfHttp);
                        var indexOfSpace = contentStr.indexOf("\b", indexOfHttp);
                        if (indexOfSpace == -1)
                            urlStr = contentStr.substring(indexOfHttp);
                        else
                            urlStr = contentStr.substring(indexOfHttp, indexOfSpace);
                        currIndex = indexOfSpace;
                    }

                    if (nonUrlStr != null && nonUrlStr != "")
                        contentNode.appendChild(document.createTextNode(nonUrlStr));
                    if (urlStr != null && urlStr != "") {
                        var urlNode = document.createElementNS("http://www.w3.org/2000/svg", "a");
                        urlNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", urlStr);
                        urlNode.setAttribute("target", "_blank");
                        urlNode.setAttribute("style", "cursor:pointer; text-decoration:underline");
                        urlNode.appendChild(document.createTextNode(urlStr));
                        contentNode.appendChild(urlNode);
                    }
                }

                // Add the content to the text node
                node.appendChild(conetentNode);
        }

        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()" onunload="unload()">
    <svg width="800px" height="2000px"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:a="http://www.adobe.com/svg10-extensions" a:timeline="independent"
     >

        <g id="chatroom" style="visibility:hidden">                
        <rect width="520" height="2000" style="fill:white;stroke:red;stroke-width:2"/>
        <text x="260" y="40" style="fill:red;font-size:30px;font-weight:bold;text-anchor:middle">Chat Window</text> 
        <text id="chattext" y="45" style="font-size: 20px;font-weight:bold"/>
      </g>
  </svg>
  
         <form action="">
            <input type="hidden" value="<?php print $name; ?>" id="username" />
        </form>

    </body>
</html>
