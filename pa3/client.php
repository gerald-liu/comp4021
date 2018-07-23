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
                    <td colspan="3">What is your message?</td>
                </tr>
                <tr>
                    <td colspan="3"><input class="text" type="text" name="message" id="msg" style= "width: 780px" /></td>
                </tr>
                <tr>
                    <td><input class="button" type="submit" value="Send Your Message" style="width: 200px" /></td>
                    <td valign="middle" align="right">Choose your color:</td>
                    <td>
						<button style="background-color:black;width:30px;height:30px" onclick="chooseColor('black');return false;"/>
						<button style="background-color:cyan;width:30px;height:30px" onclick="chooseColor('cyan');return false;"/>
						<button style="background-color:red;width:30px;height:30px" onclick="chooseColor('red');return false;"/>
						<button style="background-color:green;width:30px;height:30px" onclick="chooseColor('green');return false;"/>
						<button style="background-color:blue;width:30px;height:30px" onclick="chooseColor('blue');return false;"/>
						<button style="background-color:pink;width:30px;height:30px" onclick="chooseColor('pink');return false;"/>
					</td>
                </tr>
            </table>
            <input type="hidden" name="color" id="color" value="black">
        </form>
        
        <!--logout button-->
        <form action="logout.php" method="post"> 
			<table border="0" cellspacing="5" cellpadding="0">
				<tr>
					<td><input class="button" type="submit" value="Logout" style="width:200px"/></td>
				</tr>
			<table>
		</form>
    </body>
</html>
