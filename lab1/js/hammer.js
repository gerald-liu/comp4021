var moving_timer, count_down_timer; // Declare the two timers
var score = 0;                      // To store the score of the player
var time_remaining = 10;            // To store the time remaining
var monster_position = 0;           // To store the position of the monster
var finished = false;               // Indicate whether the game is finished or not
var hitSound, missSound;            // Declare the two sounds

function game_start(){
    // initiate two sounds
    hitSound = document.getElementById("ouch");
    missSound = document.getElementById("boo");

    // count down after one second
    setTimeout("count_down()",1000);

    // let the monster moves
    relocate();
}

function count_down(){
    // decrease remaining time by one
    time_remaining = time_remaining - 1;

    // update the text display
    document.getElementById("timer_text").innerHTML = "Time remaining: " + time_remaining + " sec";

    // call the function again after one second or finish the game
    if (time_remaining == 0) game_over();
    else count_down_timer = setTimeout("count_down()", 1000);
}

function relocate(){
    // clear previous image
    document.images[monster_position].src = "img/empty.png";

    // generate a random number between 0 and 8
    monster_position = Math.floor(Math.random() * 8);

    // move the monster to the new position
    document.images[monster_position].src = "img/monster.png";

    // call this function again after certain period of time
    moving_timer = setTimeout("relocate()", 600);
}

function game_over(){
    // set the variable, finished, to true
    finished = true;

    // clear the two timers
    clearTimeout(moving_timer);
    clearTimeout(count_down_timer);

    // alert player
    alert("Times up!!!");
}

function play_audio(hit){
    hitSound.pause();
    missSound.pause();

    if (hit) hitSound.play();
    else missSound.play();
}

function keyboard_event(event){
    // transform event into key, and then into index
    var keys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
    var hit_box = keys.indexOf(String.fromCharCode(event.keyCode));

    if (hit_box == monster_position){
        // updates player score
        score = score + 1;
        score_text.innerHTML = "Score: " + score;

        // clear the running timer
        clearTimeout(moving_timer);

        // ask the monster to relocate now
        relocate();

        play_audio(1);
    }
    else play_audio(0);
}