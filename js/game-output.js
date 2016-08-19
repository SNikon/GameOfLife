/**
 * Created by pi on 19/08/16.
 */
var GameOutput = (function() {
    "use strict";

    var constructor = function(parent, game) {
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


            element = parent;
            if(typeof element === 'string')
                element = document.getElementById(parent);

            if(!isElement(element)) {
                gameInstance = null;
                element = null;
                throw new Error('parent is not a DOM element nor ID string');
            }

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