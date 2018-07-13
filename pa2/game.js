// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.faceDirection = FaceDirection.RIGHT;
    this.verticalSpeed = 0;
    this.name = "Anonymous";
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));

        if (
            ((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
                ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
                (this.position.x == (x + w) && this.motion == motionType.LEFT))
            
            && this.position.y + PLAYER_SIZE.h == y) {
            
            if (node.getAttribute('type') == 'disappearing') {
                var platformOpacity = parseFloat(node.style.getPropertyValue("opacity"));
                platformOpacity -= 0.1;
                node.style.setProperty("opacity", platformOpacity, null);
                if (platformOpacity <= 0.0) platforms.removeChild(node);
            }
            return true;
        }            
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;
    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h) position.y = y + h;
                else position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}

Player.prototype.setName = function (name) {
    this.name = name;
}

// Constants used in the game
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var PEA_SIZE = new Size(20, 20);            // The speed of a pea
var PEA_SPEED = 10.0;                       // The speed of a pea
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a pea

var ZOMBIE_SIZE = new Size(35, 35);         // The speed of a pea
var ZOMBIE_DISPLACEMENT = 3;                //  The speed of zombies
var ZOMBIE_NUMBERS = 6;                     // Number of zombies

var PORTAL_SIZE = new Size(40, 40);         // The size of the portals

var GAME_TIME = 60;                         // Set the total time
var MAX_PEA_NUMBER = 8;                  // Max Peas numbers
var TIMER_BAR_WIDTH = 140;                  // Timer Bar

var SUNLIGHT_SIZE = new Size(40, 40);     // Size of the sunlights 
var SUNLIGHTS_NUMBER = 7;                 // Number of sunlights

// The score part
var POINT_OF_SHOOTING_ZOMBIE = 3;
var POINT_OF_GET_SUNLIGHTS = 2;
var POINT_OF_TIME_REMAINING = 1;
var BOUNS_OF_SCLAE = 2;

var EXIT_SIZE = new Size(40, 40);

// Music used in the game
var BACKGROUND_MUSIC = null;
var PLAYER_SHOOT = null;
var ZOMBIE_DIE = null;
var PLAYER_DIE = null;
var EXIT_THE_GAME = null;

// Variables in the game
var motionType = { NONE: 0, LEFT: 1, RIGHT: 2 }; // Motion enum
var FaceDirection = { LEFT: 0, RIGHT: 1 };       // Face Direction enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var score = 0;                              // The player's score
var Zoom = false;                           // Whether the canvas should be zoomed
var numberOfPeas = 0;            // Player's remaining peas
var numberOfSunlights = 0;         // Number of remaing sunlights
var timeRemaining = 60;             // Current remaing time
var timeInterval = null;
var maxTime = 0;
var zombiePea = 0;
var zombieCanShoot = true;
var zombieShoot = true;

var cheatMode = false;


// The load function for the SVG document
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;

    // Load the audio
    BACKGROUND_MUSIC = document.createElement("audio");
    BACKGROUND_MUSIC.setAttribute("src", "./bgm.mp3");
    BACKGROUND_MUSIC.volume = 0.2;
    document.body.appendChild(BACKGROUND_MUSIC);

    PLAYER_SHOOT = document.createElement("audio");
    PLAYER_SHOOT.setAttribute("src", "./player_shoot.wav");
    document.body.appendChild(PLAYER_SHOOT);

    ZOMBIE_DIE = document.createElement("audio");
    ZOMBIE_DIE.setAttribute("src", "./zombie_die.wav");
    document.body.appendChild(ZOMBIE_DIE);

    PLAYER_DIE = document.createElement("audio");
    PLAYER_DIE.setAttribute("src", "./player_die.mp3");
    document.body.appendChild(PLAYER_DIE);

    EXIT_THE_GAME = document.createElement("audio");
    EXIT_THE_GAME.setAttribute("src", "./exit.mp3");
    document.body.appendChild(EXIT_THE_GAME);

    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);
}

// removes all/certain nodes under a group
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}

// creates the zombies in the game
function createZombie(x, y) {
    var zombie = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("zombies").appendChild(zombie);
    /* Zombies' attributes:
        ox, oy: original position
        cx, cy: current position
        tx, ty: target position
        direction: FaceDirection
        transform: random displacement
    */
    zombie.setAttribute("rand", "0");
    zombie.setAttribute("x", 0);
    zombie.setAttribute("y", 0);
    zombie.setAttribute("ox", x);
    zombie.setAttribute("oy", y);
    zombie.setAttribute("cx", x);
    zombie.setAttribute("cy", y);
    zombie.setAttribute("tx", x);
    zombie.setAttribute("ty", y);
    zombie.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#zombie");
    zombie.setAttribute("transform", "translate(" + x + "," + y + ")");
    zombie.setAttribute("direction", FaceDirection.RIGHT);
}

// creates the shooter zombie
function createShootingZombie(x, y) {
    var zombie = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("zombies").appendChild(zombie);

    // Shooter zombie has one more attribute 'shooting'=1 besides normal zombie attributes
    zombie.setAttribute('id', 'shootingZombie');
    zombie.setAttribute('shooting', 1);

    zombie.setAttribute("rand", "0");
    zombie.setAttribute("x", 0);
    zombie.setAttribute("y", 0);
    zombie.setAttribute("ox", x);
    zombie.setAttribute("oy", y);
    zombie.setAttribute("cx", x);
    zombie.setAttribute("cy", y);
    zombie.setAttribute("tx", x);
    zombie.setAttribute("ty", y);
    zombie.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#zombie");
    zombie.setAttribute("transform", "translate(" + x + "," + y + ")");
    zombie.setAttribute("direction", FaceDirection.RIGHT);
    
}

// creates multiple zombies
function createMultiZombies(numOfZombie) {
    for (var i = 0; i < numOfZombie; i++) {
        var x = 0, y = 0;
        do {
            x = Math.floor(Math.random() * (SCREEN_SIZE.w - ZOMBIE_SIZE.w));
            y = Math.floor(Math.random() * (SCREEN_SIZE.h - ZOMBIE_SIZE.h));
            zombieInitialPostion = new Point(x, y);
        } while (intersect(PLAYER_INIT_POS, PLAYER_SIZE, zombieInitialPostion, ZOMBIE_SIZE) || (x<200) || (y>200));

        if (i == 0)  createShootingZombie(x, y);
        else createZombie(x, y);
    }
}

// creates multiple goodthings
function createSunlights(num) {
    numberOfSunlights = num;

    for (var i = 0; i < num; i++){
        var x=0, y=0;
        do {
            x = Math.floor(Math.random() * (SCREEN_SIZE.w - ZOMBIE_SIZE.w));
            y = Math.floor(Math.random() * (SCREEN_SIZE.h - ZOMBIE_SIZE.h));
            goodThingInitialPosition = new Point(x, y);
        } while (intersect(PLAYER_INIT_POS, PLAYER_SIZE, goodThingInitialPosition, SUNLIGHT_SIZE) || checkCollisionPlatform(goodThingInitialPosition, SUNLIGHT_SIZE) || checkCollisionSunlight(goodThingInitialPosition, SUNLIGHT_SIZE));
        createSunlight(x, y);
    }
}

// creates goodthing
function createSunlight(x, y) {
    var goodThing = svgdoc.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgdoc.getElementById('sunlights').appendChild(goodThing);
    goodThing.setAttribute('x', x);

    goodThing.setAttribute('y', y);
    goodThing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#sunlight");
}

// Check the collision with sunlights
function checkCollisionSunlight(position,size) {
    var goodThings = svgdoc.getElementById("sunlights");
    for (var i = 0; i < goodThings.childNodes.length; i++) {
        var node = goodThings.childNodes.item(i);
        if (node.nodeName != 'use') continue;
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var pos = new Point(x, y);
        if (intersect(position, size, pos, SUNLIGHT_SIZE)) return true;
    }
    return false;
}

// Check the collision with the platform
function checkCollisionPlatform(position, size) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var platformSize = new Size(w, h);

        if (intersect(position, size, pos, platformSize)) {
            return true;
        }
    }
    return false;
}

// shoots a pea from the player
function shootPea() {
    // Disable shooting for a short period of time
    canShoot = false;
    // Create the pea using the use node
    var pea = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    var pea_x = player.position.x + PLAYER_SIZE.w / 2 - PEA_SIZE.w/2;
    var pea_y = player.position.y + PLAYER_SIZE.h / 2 - PEA_SIZE.h / 2;
    pea.setAttribute("x",pea_x);
    pea.setAttribute("y", pea_y);
    pea.setAttribute("direction", player.faceDirection);
    pea.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#pea");
    svgdoc.getElementById("peas").appendChild(pea);
    setTimeout("canShoot=true", SHOOT_INTERVAL);  

    // Play sound
    PLAYER_SHOOT.play();

    if (!cheatMode) {
        svgdoc.getElementById("peaNum").firstChild.data = --player.pea;
    }
}

// handles the zombie shooting
function zombieShootPea() {
    if (zombieCanShoot && (parseInt(Math.random() * 100) % 50) == 0 ) {
        zombieCanShoot = false;
        var zombie = svgdoc.getElementById("shootingZombie");
        if (zombie != null) {
            var pea = svgdoc.createElementNS('http://www.w3.org/2000/svg', 'use');
            var x = parseInt(zombie.getAttribute('cx')) + ZOMBIE_SIZE.w / 2;
            var y = parseInt(zombie.getAttribute('cy')) + ZOMBIE_SIZE.h / 2;
            pea.setAttribute('x', x);
            pea.setAttribute('y', y);
            pea.setAttribute('direction', parseInt(zombie.getAttribute('direction')));
            pea.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#zombie_pea");
            svgdoc.getElementById('zombie_peas').appendChild(pea);
        } else {
            zombieCanShoot = false;
        }
    }
}

// keydown handling function for the SVG document
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.motion = motionType.LEFT;
            player.faceDirection = FaceDirection.LEFT;
            break;

        case "D".charCodeAt(0):
            player.motion = motionType.RIGHT;
            player.faceDirection = FaceDirection.RIGHT;
            break;
			
        case "W".charCodeAt(0):
            if (player.isOnPlatform() || cheatMode) player.verticalSpeed = JUMP_SPEED;
            break;

        case "C".charCodeAt(0):
            cheatMode = true;
            svgdoc.getElementById("peaNum").firstChild.data = 'Infinite';
            PlayerObject = svgdoc.getElementById("player");
            playerObject.setAttribute("opacity", 0.5);
            break;

        case "V".charCodeAt(0):
            cheatMode = false;
            svgdoc.getElementById("peaNum").firstChild.data = player.pea;
            PlayerObject = svgdoc.getElementById("player");
            playerObject.setAttribute("opacity", 1.0);
            break;

	// add a case to shoot pea
        case " ".charCodeAt(0):
            if (canShoot && (player.pea > 0 || cheatMode)) shootPea();
            break;
    }
}

// keyup handling function for the SVG document
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


// checks collision
function collisionDetection() {
    // Check whether the player collides with a zombie
    var zombies = svgdoc.getElementById("zombies");

    if (!cheatMode) {
        for (var i = 0; i < zombies.childNodes.length; i++) {
            var zombie = zombies.childNodes.item(i);
            var zombie_x = parseInt(zombie.getAttribute("cx"));
            var zombie_y = parseInt(zombie.getAttribute("cy"));
            var zombiePosition = new Point(zombie_x, zombie_y);

            // For each zombie check if it overlaps with the player
            // if yes, stop the game
            if (intersect(player.position, PLAYER_SIZE, zombiePosition, ZOMBIE_SIZE)) {
                PLAYER_DIE.play();
                gameOver();
                return;
            }

        }
    }

    // Check whether a pea hits a zombie
    var peas = svgdoc.getElementById("peas");
    for (var i = 0; i < peas.childNodes.length; i++) {
        var pea = peas.childNodes.item(i);
        var pea_x = parseInt(pea.getAttribute("x"));
        var pea_y = parseInt(pea.getAttribute("y"));
        var peaPosition = new Point(pea_x, pea_y);

        for (var j = 0; j < zombies.childNodes.length; j++) {
            var zombie = zombies.childNodes.item(j);
            var zombie_x = parseInt(zombie.getAttribute("cx"));
            var zombie_y = parseInt(zombie.getAttribute("cy"));
            var zombiePosition = new Point(zombie_x, zombie_y);

	// For each pea check if it overlaps with any zombie
            // if yes, remove both the zombie and the pea
            if (intersect(zombiePosition, ZOMBIE_SIZE, peaPosition, PEA_SIZE)) {
                ZOMBIE_DIE.play();
                peas.removeChild(pea);
                zombies.removeChild(zombie);
                i--;
                j--;

                if (Zoom) score += BOUNS_OF_SCLAE * POINT_OF_SHOOTING_ZOMBIE;
                else score += POINT_OF_SHOOTING_ZOMBIE;
                updateScore(score);
            }
        }
    }
    // Check Portal
    var portal_left = svgdoc.getElementById("portal_left");
    var portal_left_position = new Point(parseInt(portal_left.getAttribute('x')), parseInt(portal_left.getAttribute('y')));
    if (intersect(player.position, PLAYER_SIZE, portal_left_position, PORTAL_SIZE))
        player.position = new Point(500, 100);

    var portal_right = svgdoc.getElementById("portal_right");
    var portal_right_position = new Point(parseInt(portal_right.getAttribute('x')), parseInt(portal_right.getAttribute('y')));
    if (intersect(player.position, PLAYER_SIZE, portal_right_position, PORTAL_SIZE))
        player.position = new Point(40, 180);

    // Check whether the player get goodthings
    var goodThings = svgdoc.getElementById("sunlights");
    for (var i = 0; i < goodThings.childNodes.length; i++) {
        var goodThing = goodThings.childNodes.item(i);
        var goodThing_X = parseInt(goodThing.getAttribute('x'));
        var goodThing_Y = parseInt(goodThing.getAttribute('y'));
        var goodThingPosition = new Point(goodThing_X, goodThing_Y);
        if (intersect(player.position, PLAYER_SIZE, goodThingPosition, SUNLIGHT_SIZE)) {
            goodThings.removeChild(goodThing);
            i--;
            numberOfSunlights--;

            if (Zoom) score += BOUNS_OF_SCLAE * POINT_OF_GET_SUNLIGHTS;
            else score += POINT_OF_GET_SUNLIGHTS;
            updateScore(score);
        }
    }

    // Check whether zombie pea hit the player
    if (!cheatMode) {
        var zombiePeas = svgdoc.getElementById("zombie_peas");
        for (var i = 0; i < zombiePeas.childNodes.length; i++) {
            var pea = zombiePeas.childNodes.item(i);
            var peaX = parseInt(pea.getAttribute('x'));
            var peaY = parseInt(pea.getAttribute('y'));
            var peaPosition = new Point(peaX, peaY);
            if (intersect(peaPosition, PEA_SIZE, player.position, PLAYER_SIZE)) {
                PLAYER_DIE.play();
                zombiePeas.removeChild(pea);
                gameOver();
                return;
            }
        }
    }
    // Check Exit
    var exit = svgdoc.getElementById("exit");
    var exit_X = parseInt(exit.getAttribute('x'));
    var exit_Y = parseInt(exit.getAttribute('y'));
    var exitPosition = new Point(exit_X, exit_Y);
    if (intersect(player.position, PLAYER_SIZE, exitPosition, EXIT_SIZE)) {
        if (numberOfSunlights == 0) {
            EXIT_THE_GAME.play();
            score += timeRemaining;
            updateScore(score);
            gameOver();
        }
    }
}


// This function updates the position of the peas
function movePeas() {
    // Go through all peas
    var peas = svgdoc.getElementById("peas");
    for (var i = 0; i < peas.childNodes.length; i++) {
        var node = peas.childNodes.item(i);
        
        // Update the position of the pea
        var x = parseInt(node.getAttribute("x"));
        if (parseInt(node.getAttribute("direction")) == FaceDirection.LEFT)
            node.setAttribute("x", x - PEA_SPEED);
        else
            node.setAttribute("x", x + PEA_SPEED);
        
        

        // If the pea is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x<0) {
            peas.removeChild(node);
            i--;
        }
    }


    if (!zombieCanShoot) {
        var zombie_pea = svgdoc.getElementById("zombie_peas");
        var node = zombie_pea.childNodes.item(0);
        if (node && parseInt(node.getAttribute('direction')) == FaceDirection.LEFT)
            node.setAttribute('x', parseInt(node.getAttribute('x')) + PEA_SPEED);
        else if (node)
            node.setAttribute('x', parseInt(node.getAttribute('x')) - PEA_SPEED);
       
        // If the pea is not inside the screen delete it from the group
        if (node && ((parseInt(node.getAttribute('x')) > SCREEN_SIZE.w) || (parseInt(node.getAttribute('x')) < 0))) {
            zombie_pea.removeChild(node);
            zombieCanShoot = true;
        }
    }
    
}

// Handle the zombies' movement
function moveZombies() {
    var zombies = svgdoc.getElementById("zombies");
    for (var i = 0; i < zombies.childNodes.length ; i++) {
        var node = zombies.childNodes.item(i);
        var rand = parseInt(node.getAttribute("rand"));
        var originalX = parseInt(node.getAttribute("ox"));
        var originalY = parseInt(node.getAttribute("oy"));
        var currentX = parseInt(node.getAttribute("cx"));
        var currentY = parseInt(node.getAttribute("cy"));
        var targetX = parseInt(node.getAttribute("tx"));
        var targetY = parseInt(node.getAttribute("ty"));


        // Since we want to make the movement smooth, We cannot simply choose a random location for the zombie
        if ( currentX >= targetX) {
            node.setAttribute("transform", "translate(" + (currentX + ZOMBIE_SIZE.w) + "," + currentY + ") scale (-1, 1)");
            node.setAttribute("direction", FaceDirection.RIGHT);
        } else {
            node.setAttribute("transform", "translate(" + currentX + "," + currentY + ")");
            node.setAttribute("direction", FaceDirection.LEFT);
        }

        // Set the current location
        var currentDX = rand;
        var currentDY = Math.sqrt(ZOMBIE_DISPLACEMENT * ZOMBIE_DISPLACEMENT - rand * rand);

        node.setAttribute("cx", targetX > currentX ? currentX + currentDX : currentX - currentDX);
        node.setAttribute("cy", targetY > currentY ? currentY + currentDY : currentY - currentDY);

        // Set new parameters next target and the original places
        if ((originalX <= targetX && parseInt(node.getAttribute("cx")) >= targetX) ||
            (originalY <= targetY && parseInt(node.getAttribute("cy")) >= targetY) ||
            (originalX >= targetX && parseInt(node.getAttribute("cx")) <= targetX) ||
            (originalY >= targetY && parseInt(node.getAttribute("cy")) <= targetY)) {
            node.setAttribute("tx", Math.floor(Math.random() * (SCREEN_SIZE.w - ZOMBIE_SIZE.w)));
            node.setAttribute("ty", Math.floor(Math.random() * (SCREEN_SIZE.h - ZOMBIE_SIZE.h)));
            node.setAttribute("ox", currentX);
            node.setAttribute("oy", currentY);
            node.setAttribute("rand", Math.random() * ZOMBIE_DISPLACEMENT);
            
        }
    }
}

// Initialize the game
function initializeGame(Zoom_y) {
    name = prompt("What is your name?", name);
    if (name.length == 0 || name == '' || name == "null" || name == null)
        name = "Anonymous";

    svgdoc.getElementById("startScreen").style.setProperty("visibility", "hidden", null);

    cheatMode = false;
    ZoomMode = Zoom_y;
    if (Zoom_y) {
        zoom = 2.0;
        Zoom = true;
    }

    score = 0;
    timeRemaining = 0;

    startGame();
}

// startGame function
function startGame() {
    // Remove previous zombies or peas
    cleanUpGroup("zombies", false);
    cleanUpGroup("peas", false);

    // Remove the two timers
    clearInterval(gameInterval);
    clearInterval(timeInterval);

    // Create the player
    player = new Player();
    player.setName(name);

    // Show player's name
    svgdoc.getElementById("nameValue").firstChild.data = name;
    namePlace = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    namePlace.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#name");
    svgdoc.getElementById("playerName").appendChild(namePlace);
    namePlace.setAttribute("x", player.position.x+20);
    namePlace.setAttribute("y", player.position.y + 20);

    // Time remaining
    timeRemaining = GAME_TIME;
    maxTime = timeRemaining;

    // Peas
    player.pea = MAX_PEA_NUMBER;
    zombiePea = 1;

    // Sunlights
    numberOfSunlights = SUNLIGHTS_NUMBER;

    // Side Boxes
    svgdoc.getElementById("score").firstChild.data = score;
    svgdoc.getElementById("peaNum").firstChild.data = player.pea;

    // Create sunlights
    createSunlights(SUNLIGHTS_NUMBER);

    // Create zombies
    createMultiZombies(ZOMBIE_NUMBERS);

    // Play Sound
    BACKGROUND_MUSIC.play();

    // Start counting of remaining time;
    timeInterval = setInterval("counter()", 1000);

    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}

// Counter
function counter() {
    timeRemaining = timeRemaining - 1;
    svgdoc.getElementById("time_remaining").firstChild.data = timeRemaining;
    svgdoc.getElementById("time_remaining_bar").setAttribute("width", Math.floor(timeRemaining / maxTime * TIMER_BAR_WIDTH))
  
}

// This function updates the position and motion of the player in the system
function gamePlay() {
    // Check time remaining
    if (timeRemaining <= 0) {
        PLAYER_DIE.play();
        gameOver();
    }

    // Check collisions, call the collisionDetection when you create the zombies and peas
    collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT) displacement.x = -MOVE_DISPLACEMENT;
        
    if (player.motion == motionType.RIGHT) {
        displacement.x = MOVE_DISPLACEMENT;
        playerObject = svgdoc.getElementById("player");
        playerObject.setAttribute("transform", "translate(" + PLAYER_SIZE.w + ", 0) scale(-1,1)");
    }
        
    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0) player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move zombies and its pea
    moveZombies();
    zombieShootPea();
    movePeas();
    
    // Move the peas, call the movepeas when you create the zombies and peas
    updateScreen();
}

// Clear zombies
function clearZombies() {
    var zombies = svgdoc.getElementById("zombies");
    for (var i = 0; i < zombies.childNodes.length; i++)
        zombies.removeChild(zombies.childNodes.item(i--));
    
    var zombiePeas = svgdoc.getElementById("zombie_peas");
    for (var i = 0; i < zombiePeas.childNodes.length; i++)
        zombiePeas.removeChild(zombiePeas.childNodes.item(i--));
    
}

// Clear Disappearing Platforms
function clearDisappearingPlatforms() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        if (node.getAttribute('type') == 'disappearing') {
            platforms.removeChild(node);
            i--;
        }
    }
}


// Create disappearing platform
function createDisappearingPlatforms(x, y, width, height) {
    var platform = svgdoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
    platform.setAttribute('type', 'disappearing');
    platform.setAttribute('x', x);
    platform.setAttribute('y', y);
    platform.setAttribute('width', width);
    platform.setAttribute('height', height);
    platform.style.setProperty('fill', 'bisque', null);
    platform.style.setProperty('opacity', 0.5, null);
    svgdoc.getElementById('platforms').appendChild(platform);
}

function updateScreen() {
    // Transform the player
    if (player.faceDirection == FaceDirection.LEFT) {
        playerObject = svgdoc.getElementById("player");
        playerObject.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")"+"translate(" + PLAYER_SIZE.w + ", 0) scale(-1,1)");
    }
    else {
        playerObject = svgdoc.getElementById("player");
        playerObject.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    }

    // Transform player's name
    svgdoc.getElementById("name").setAttribute("transform", "translate(" + player.position.x + "," + (player.position.y -440)+ ")");
            
    // Calculate the scaling and translation factors	
    var scale = new Point(zoom, zoom);
    var translate = new Point();
    
    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0) 
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0) 
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;
            
    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");	
}

// updates the score
function updateScore(score) {
    svgdoc.getElementById("score").firstChild.data = score;
}

// Clear sunlights
function clearSunlights() {
    var goodThings = svgdoc.getElementById("sunlights");
    for (var i = 0; i < goodThings.childNodes.length; i++) {
        goodThings.removeChild(goodThings.childNodes.item(i--));
    }
}

// sets the zoom level to 2
function setZoom() { zoom = 2.0; }

// handles the restart situation
function restartGame() {
    // Remove other things
    cleanUpGroup("playerName", false);
    cleanUpGroup("zombies", false);
    cleanUpGroup("peas", false);
    cleanUpGroup("highscoreText", false);

    // Rebuild the disappearing platforms
    clearDisappearingPlatforms();
    createDisappearingPlatforms(240, 80, 40, 20);
    createDisappearingPlatforms(320, 80, 80, 20);
    createDisappearingPlatforms(180, 420, 100, 20);

    // clear sunlights
    clearSunlights();
    clearZombies();
    // other staff
    score = 0;
    cheatMode = false;
    zoom = 1.0
    numberOfSunlights = 0;
    Zoom = false;
    zombieCanShoot = true;
    playerObject.setAttribute("opacity", 1.0);
    // Initialize the game
    svgdoc.getElementById("highscoreTable").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById('startScreen').style.setProperty("visibility", "visible", null);
}


// GameOver
function gameOver() {
    BACKGROUND_MUSIC.pause();
    clearInterval(gameInterval);
    clearInterval(timeInterval);

    table = getHighScoreTable();
    var record = new Record(player.name, score);

    // Insert the new score record
    var position = table.length;
    for (var j = 0; j < table.length; j++) {
        if (record.score > table[j].score) {
            position = j;
            break;
        }
    }

    table.splice(position, 0, record);

    // Set and display
    setHighScoreTable(table);
    displayHighScoreTable(table, position);
}