/**
 * Created by pi on 19/08/16.
 */
var GameOutput = (function() {
    "use strict";

    var constructor = function() {
        var element = null;
        var gameInstance = null;

        this.init = function(parent, game) {
            if(parent == null || game == null)
                throw new Error('missing parameters');

            gameInstance = game;
            if( typeof gameInstance.tick != 'function' || typeof gameInstance.state != 'function') {
                gameInstance = null;
                throw new Error('game parameter does not implement the necessary methods');
            }


            var hook = parent;
            if(typeof hook === 'string')
                hook = document.getElementById(parent);

            if(!isElement(hook)) {
                gameInstance = null;
                hook = null;
                throw new Error('parent is not a DOM element nor ID string');
            }

            element = document.createElement('canvas');
            hook.appendChild(element);
        };

        this.getTarget = function() {
            return element;
        };

        this.tick = function() {
            gameInstance.tick();
            this.display();
        };

        this.display = function() {
            throw new Error('Not implemented.');
        }
    };

    return constructor;
})();