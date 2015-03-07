const KEYS = {
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

const CONTROLS = {
   UP: 0,
   DOWN: 1
}

var InputManager = {};

(function() {
   /** Keyboard stuff */
   var keyDown = {};

   document.addEventListener('keydown', function(evt) {
       keyDown[evt.keyCode] = true;
   });
   document.addEventListener('keyup', function(evt) {
       keyDown[evt.keyCode] = false;
   });

   InputManager.keyDown = function(key) {
      return keyDown[key];
   };

   InputManager.control = function(player, control) {
      var key = -1;
      switch (control) {
         case CONTROLS.UP:
            key = (player === 0 ? KEYS.W : KEYS.UP);
            break;
         case CONTROLS.DOWN:
            key = (player === 0 ? KEYS.S : KEYS.DOWN);
            break;
         default:
            throw 'Control ' + control + ' not recognized';
      }

      return InputManager.keyDown(key);
   };

   /** Mouse stuff */
   var clickCallbacks = [];
   var hoverCallbacks = [];

   InputManager.on = function(action, callback) {
      if (action === 'click') {
         clickCallbacks.push(callback);
      }
      else if (action === 'mousemove') {
         hoverCallbacks.push(callback);
      }
   };

   document.addEventListener('mousemove', function(evt) {
      for(var i = 0; i < hoverCallbacks.length; i ++) {
         hoverCallbacks[i](evt);
      }
   });

   document.addEventListener("mousedown", function(evt) {
      for(var i = 0; i < clickCallbacks.length; i ++) {
         clickCallbacks[i](evt);
      }
   });

})();