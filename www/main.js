var Juicy = function(canvas, game_width, game_height) {
   this.canvas = canvas;
   this.context = canvas.getContext('2d');

   // Set game size
   this.game_width = game_width;
   this.game_height = game_height;

   // Fix weird cursor problems
   this.canvas.onselectstart = function() { return false; } 

   // Resize the canvas
   var self = this;
   this.setAspectRatio = function(aspectRatio) {
      window.onresize = function() {
         var minSize = Math.min(window.innerWidth, window.innerHeight * aspectRatio);

         self.canvas.width = minSize;
         self.canvas.height = minSize / aspectRatio;

         self.scale_x = self.canvas.width / self.game_width;
         self.scale_y = self.canvas.height / self.game_height;
      };
      window.onresize();
   };
   this.setAspectRatio(game_width / game_height);

   this.state = null;

   // Enable chaining
   return this;
};

Juicy.prototype.setState = function(state) {
   if (this.state && this.state.destroy)
      this.state.destroy();

   this.state = state;
   this.state.game = this;

   if (!this.state.initialized) {
      this.state.init();
      this.state.initialized = true;
   }

   // Enable chaining
   return this;
};

Juicy.prototype.run = function() {
   this.running = true;
   var lastTime = new Date().getTime();

   var self = this;
   var update = function() {
      if (!self.running)
         return;

      // Request another frame
      requestAnimFrame(update);

      var nextTime = new Date().getTime();
      var dt = (nextTime - lastTime) / 1000;
      if (self.state)
         self.state.update(dt * 2);
      lastTime = nextTime;

      self.render();
   };

   update();

   // Enable chaining
   return this;
};

Juicy.prototype.pause = function() {
   this.running = false;
}

Juicy.prototype.render = function() {
   if (this.state) {
      this.context.save();

      this.context.scale(this.scale_x, this.scale_y);
      if (!this.state.stopClear)
         this.context.clearRect(0, 0, this.game_width, this.game_height);

      try {
         this.state.render(this.context);
      } catch (err) {
         console.error(err.stack);
         this.running = false;
      }

      this.context.restore();
   }

   // Enable chaining
   return this;
};

Juicy.prototype.on = function(action, callback) {
   var self = this;
   if (action === 'mousedown' || action === 'mousemove') {
      document.addEventListener(action, function(evt) {
         callback(self.getCanvasCoords(evt));
      });
   }
   else {
      document.addEventListener(action, callback);
   }

   // Enable chaining
   return this;
};

/**
* Returns a handy point object in the local coordinate
*  space of the canvas
*/
Juicy.prototype.getCanvasCoords = function(evt) {
   var canvasRect = this.canvas.getBoundingClientRect();
   var mx = evt.x || evt.clientX - canvasRect.left;
   var my = evt.y || evt.clientY - canvasRect.top;

   return {
      x: Math.floor(mx) * this.game_width /  this.canvas.width, 
      y: Math.floor(my) * this.game_height /  this.canvas.height
   };
};

var GAME_WIDTH = 1024;
var GAME_HEIGHT = 768;
var GAME_CENTER = new SAT.Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2);
var Game = new Juicy(document.getElementById("game-canvas"), GAME_WIDTH, GAME_HEIGHT);
document.addEventListener('DOMContentLoaded', function() {
   Game.setState(new TitleScreen()).run();
}, false);

/*
 * Create a handy dandy canvas for text, since drawing text is expensive
 */
function renderText(text, font, fillStyle) {
   var canvas = document.createElement('canvas');
   var context = canvas.getContext('2d');

   context.font = font;
   context.fillStyle = fillStyle;

   var size = context.measureText(text);
   size.height = parseInt(font, 10);

   canvas.width = Math.ceil(size.width);
   canvas.height = Math.ceil(size.height * 5 / 3);

   context.textBaseline = 'top';
   context.font = font;
   context.fillStyle = fillStyle;

   context.fillText(text, 0, 0);//size.height);

   return canvas;
};

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}