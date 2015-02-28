// Set up the canvas
var canvas =  document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;
var context = canvas.getContext("2d");
canvas.onselectstart = function() { return false; } // Fix weird cursor problems

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

update();
