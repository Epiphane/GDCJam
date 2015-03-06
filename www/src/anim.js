/** 
 * Rectangles bounce when you click on em.  Iterate that animation here.
 */
function bounce(rect, t) {
   var bounceFactor = (Math.sin(t) + 1) * t * 0.15;

   // Decrementing t is left up to the caller
   var x = rect.pos.x - bounceFactor;
   var y = rect.pos.y - bounceFactor;
   var width = rect.w + bounceFactor * 2;
   var height = rect.h + bounceFactor * 2;

   return new SAT.Box(new SAT.Vector(x, y), width, height);
}