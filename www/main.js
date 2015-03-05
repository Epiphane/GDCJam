var aspectRatio = 5/3;

// Set up the canvas
var canvas =  document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;
if (canvas.width / canvas.height > aspectRatio) { // Too wide
    canvas.width = canvas.height * aspectRatio;
}
else { // Too tall
    canvas.height = canvas.width / aspectRatio;
}
gameSize = { width: 1280, height: 768 };
// canvas.width = gameSize.width;
// canvas.height = gameSize.height;
var context = canvas.getContext("2d");
canvas.onselectstart = function() { return false; } // Fix weird cursor problems

var juice = new Image();
juice.src = "./asset/juice.png";

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
var time = new Date().getTime();
function update() {
    requestAnimFrame(update);

    var nextTime = new Date().getTime();
    currentState.update((nextTime - time) / 25);
    time = nextTime;

    if (!currentState.gameDone) {
        context.clearRect(0 , 0 , canvas.width, canvas.height);
    }
    context.save();
    context.scale(canvas.width / gameSize.width, canvas.height / gameSize.height);

    currentState.draw(context);
    context.restore();
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
    var mx = evt.x || evt.clientX;// - canvasRect.left;
    var my = evt.y || evt.clientY;// - canvasRect.top;
 
    // console.log({
    //     x: Math.floor(mx) * gameSize.width /  canvas.width, 
    //     y: Math.floor(my) * gameSize.height /  canvas.height
    // });
    return {
        x: Math.floor(mx) * gameSize.width /  canvas.width, 
        y: Math.floor(my) * gameSize.height /  canvas.height
    };
}

document.addEventListener('DOMContentLoaded', update, false);

// update();
// 
