/*
 * SUPER L337 CANVAS ARROW DRAWING
 * Not really, just kinda hacky so
 * it's clear where we're drawing.
 */
var ARROW_SHAFT_WIDTH = 20;
var ARROW_TIP_BASE_WIDTH = 40;
var ARROW_HEAD_LENGTH = 100;
var ARROW_SHAFT_HEIGHT = 30;
var ARROW_MARGIN = 200;
CanvasRenderingContext2D.prototype.drawArrow = function(arrowX, fillPercent, xScale, yScale, fillStyle, strokeStyle, jankyArrowScale) {
    // FILL ARROW
    this.save();

    this.translate(arrowX, GAME_HEIGHT / 2 - yScale * 65);
    this.scale(xScale, yScale);

    var clipY = -fillPercent * (ARROW_HEAD_LENGTH + ARROW_SHAFT_HEIGHT) + ARROW_SHAFT_HEIGHT
    this.rect(-1000,
                 clipY, 
                 2000, 
                 1000);
    this.clip();

    if (jankyArrowScale)
        this.scale(jankyArrowScale, jankyArrowScale);

    this.beginPath();
    this.moveTo(-ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    this.lineTo(-ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo(-ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo(  0, -ARROW_HEAD_LENGTH);  // Arrow point
    this.lineTo( ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo( ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo( ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    this.closePath();

    this.fillStyle = fillStyle;
    this.fill();
    this.restore();

    // ARROW OUTLINE
    this.save();

    this.translate(arrowX, GAME_HEIGHT / 2 - yScale * 65);
    this.scale(1, yScale);

    this.beginPath();
    this.moveTo(-ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    this.lineTo(-ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo(-ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo(  0, -ARROW_HEAD_LENGTH);  // Arrow point
    this.lineTo( ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo( ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    this.lineTo( ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    this.closePath();

    this.strokeStyle = strokeStyle;
    this.lineWidth = 5;
    this.stroke();

    this.restore();
}