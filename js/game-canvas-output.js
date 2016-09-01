/**
 * Created by pi on 12/08/16.
 */

var GameCanvasOutput = (function() {
    "use strict";

    var constructor = function() {
        if(constructor.superClass)
            constructor.superClass.constructor.call(this);

        this.display = function() {
            var canvas = this.getTarget();
            var context = canvas.getContext('2d');

            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };


    return constructor;
})();
