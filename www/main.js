// Set up the canvas
var canvas =  document.getElementById("game-canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight - 4;
var context = canvas.getContext("2d");
canvas.onselectstart = function() { return false; } // Fix weird cursor problems

var currentState = InGame();
 
/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
function update() {
    requestAnimFrame(update);

    currentState.update();
    currentState.draw();
}

function changeState(state) {
    currentState = state;
    currentState.init();
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