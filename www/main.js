// Set up the canvas
var canvas =  document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;
var context = canvas.getContext("2d");
canvas.onselectstart = function() { return false; } // Fix weird cursor problems

// Load sounds
var soundTrack = new buzz.sound("./asset/song", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false,
    loop: true
});

var startSound1 = new buzz.sound("./asset/start1", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var startSound2 = new buzz.sound("./asset/start2", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var bounce1 = new buzz.sound("./asset/bounce1", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var bounce2 = new buzz.sound("./asset/bounce2", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var bounce3 = new buzz.sound("./asset/bounce3", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var bounce4 = new buzz.sound("./asset/bounce4", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});


var wall1 = new buzz.sound("./asset/wall1", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var wall2 = new buzz.sound("./asset/wall2", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var wall3 = new buzz.sound("./asset/wall3", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});

var wall4 = new buzz.sound("./asset/wall4", {
    formats: [ "mp3", "wav" ],
    preload: true,
    autoplay: false
});


// State
currState = new TitleScreen();
changeState(currState);

var keyDown = {};

document.addEventListener('keydown', function(evt) {
    keyDown[evt.keyCode] = true;
});
document.addEventListener('keyup', function(evt) {
    keyDown[evt.keyCode] = false;
});
 
var KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,

    W: 87,
    A: 65,
    S: 83,
    D: 68,
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
function update() {
    requestAnimFrame(update);

    currentState.update();

    context.clearRect(0 , 0 , canvas.width, canvas.height);
    currentState.draw(context);
}

function changeState(state) {
    currentState = state;
    currentState.init();
}

function startGame() {
    changeState(new InGame());
    soundTrack.play();
}

 
/**
 * Returns a handy point object in the local coordinate
 *  space of the canvas
 */
function getCanvasCoords(evt) {
    var canvasRect = canvas.getBoundingClientRect();
    var mx = evt.x - canvasRect.left;
    var my = evt.y - canvasRect.top;
 
    return {x: Math.floor(mx), y: Math.floor(my)};
}

document.addEventListener('DOMContentLoaded', update, false);

// update();
// 
