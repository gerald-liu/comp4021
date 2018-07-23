<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Add Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="text/javascript">
        //<![CDATA[
        function load() {
            var name = "<?php print $name; ?>";
            setTimeout("document.getElementById('msg').focus()",100);
        }

        function chooseColor(color) {
            var filled = document.getElementById("color");
            if (color != filled.value)
                if (confirm("Update the color?")) filled.value = color;
        }
        //]]>
        </script>
    </head>

    <body style="text-align: left" onload="load()">
        <form action="add_message.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td>What is your message?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="message" id="msg" style= "width: 780px" /></td>
                </tr>
                <tr>
                    <td><input class="button" type="submit" value="Send Your Message" style="width: 200px" /></td>
                    <td>Choose your color: </td>
                    <td>
						<div style="position:relative">
							<div style="background-color:black;left:0px" onclick="chooseColor('black')"></div>
							<div style="background-color:cyan;left:50px" onclick="chooseColor('cyan')"></div>
							<div style="background-color:red;left:100px" onclick="chooseColor('red')"></div>
							<div style="background-color:green;left:150px" onclick="chooseColor('green')"></div>
							<div style="background-color:blue;left:200px" onclick="chooseColor('blue')"></div>
							<div style="background-color:pink;left:250px" onclick="chooseColor('pink')"></div>
						</div>
					</td>
                </tr>
            </table>
            <input type="hidden" name="color" id="color" value="black">
        </form>
        
        <!--logout button-->
        <a href="logout.php">Click here to logout</a>
    </body>
</html>
