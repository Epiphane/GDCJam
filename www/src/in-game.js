/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.x2 = function() { return this.x + this.width };
    this.y2 = function() { return this.y + this.height };
    this.height = height;
    this.width = width;
    this.bounceTime = 0;
}
 
/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Circle(x, y, radius, alpha) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.alpha = 0.4;
}
 
/**
 * rectIntersection takes in two rectangle objects and determines whether they
 *  intersect.
 *
 * If they intersect, this function returns the rectangle that represents the area
 *  they intersect. Otherwise, it returns null.
 */
function rectIntersection(rectA, rectB) {
    var intersectTop    = Math.max(rectA.y,    rectB.y);
    var intersectRight  = Math.min(rectA.x2(), rectB.x2());
    var intersectBottom = Math.min(rectA.y2(), rectB.y2());
    var intersectLeft   = Math.max(rectA.x,    rectB.x);
 
    var intersectWidth  = intersectRight - intersectLeft;
    var intersectHeight = intersectBottom - intersectTop;
 
    if (intersectWidth > 0 && intersectHeight > 0) {
        return new Rect(intersectLeft, intersectTop, intersectWidth, intersectHeight);
    }
    return null;
}
 
/**
 * rectContainsPoint returns true if the specified rectangle contains the point,
 *  false otherwise.
 */
function rectContainsPoint(rect, point) {
    if (point.x > rect.x && point.x < rect.x2() &&
        point.y > rect.y && point.y < rect.y2() ) {
        return true;
    }
    return false;
}
 
// Which rectangle is the user dragging (if any?)
var draggingRect = null;
var draggingTarget = null;
var wasIntersecting = false;
 
var circles = [];
 
/** Draw the specified rect on screen with specified color. */
function drawRect(rect, color) {
    // console.log(rect)
    context.fillStyle = color;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
}
 
/** 
 * Rectangles bounce when you click on em.  Iterate that animation here.
 */
function iterateBounciness(rect) {
   var bounceFactor = (Math.sin(rect.bounceTime) + 1) * rect.bounceTime * 0.15;
   if (rect.bounceTime > 0) {
       rect.bounceTime--;
   }
 
   var bouncedRect = new Rect(0, 0, 0, 0);
   bouncedRect.x = rect.x - bounceFactor;
   bouncedRect.y = rect.y - bounceFactor;
   bouncedRect.width  = rect.width  + bounceFactor * 2;
   bouncedRect.height = rect.height + bounceFactor * 2;
   return bouncedRect;
}
 
/**
 * Animate the circles that emanate out from intersections
 */
function iterateCircles() {
    for (var ndx = circles.length - 1; ndx >= 0; ndx--) {
        circles[ndx].radius += 2;
        circles[ndx].alpha -= 0.03;
 
        context.beginPath();
        context.arc(circles[ndx].x, circles[ndx].y, 
                    circles[ndx].radius, 0, 2*Math.PI, false);
        context.fillStyle = "rgba(255, 255, 255, " + circles[ndx].alpha + ")";
        context.fill();
 
        if (circles[ndx].alpha < 0) {
            circles.splice(ndx, 1);
        }
    }
}
 
var InGame = function() {
    var game = {};
 
    var rect1 = new Rect(10, 10, 50, 50);
    var rect2 = new Rect(60, 100, 160, 220);

    game.init = function() {
        document.addEventListener('keydown', function(evt) {
            console.log(evt);
        });
        console.log('hi');
    };

    /**
     * Main animation loop!  Check for intersection, update rectangle
     *  objects, and draw to screen.
     */
    game.update = function() {
    };

    game.draw = function() {
        var bouncedRect1 = iterateBounciness(rect1);    
        var bouncedRect2 = iterateBounciness(rect2);

        context.clearRect(0 , 0 , canvas.width, canvas.height);
     
        drawRect(bouncedRect1, "rgb(255, 170, 170)");
        drawRect(bouncedRect2, "rgb(212, 106, 106)");
     
        iterateCircles();
    };

    return game;
};