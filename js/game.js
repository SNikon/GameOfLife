/**
 * Created by pi on 29/07/16.
 */

var Game = (function() {
    "use strict";

    // Public static functions
    function _makePrivateState(rootBoard, index, size) {
        return {
            'state': rootBoard[index], // Public state is a boolean
            'neighbours': []
        };
    }

    // Public static value properties
    Object.defineProperties(constructor, {
        'ALIVE': {
            enumerable: true,
            value: true,
            writable: false
        },
        'DEAD': {
            enumerable: true,
            value: false,
            writable: false
        }
    });

    function constructor() {
        var board = null;
        var nextBoard = null;
        var size = 0;
        var live = [];

        this.init = function(rootBoard) {
            // If already initialized, don't do it again. Make a new game if you want.
            if(size > 0)
                throw new Error('Game already initialized');
            if(!Array.isArray(rootBoard))
                throw new Error('Invalid board');

            var sqrt = Math.sqrt(rootBoard.length);
            // Valid board is length is positive and if the square root of the length is an integer (no decimals)
            var isSquare = rootBoard.length > 0 && (~~sqrt) === sqrt;
            if(isSquare) {
                size = sqrt;

                var valid = true;
                board = rootBoard.map(function(publicState, index) {
                    if(typeof publicState != 'boolean') {
                        valid = false;
                        // Invalid state, just don't do anything
                        return null;
                    }

                    return _makePrivateState(rootBoard, index, size);
                });

                if(!valid) {
                    board = null;
                    throw new Error('Invalid state in board');
                }

                nextBoard = board.map(function (x) {
                    return x;
                }); // Just copy
                live = board.map(function (x) {
                    return {};
                });
            } else {
                throw new Error('Board must be square')
            }
        };

        this.state = function(row, column) {
            if((row == null && column == null) || (row != null && column != null)) {
                if (row == null) // No slot requested, return the board
                    return board.map(function (x) {
                        return x.state;
                    }); // Only information about being dead or alive, internal states are hidden
                else {
                    // Valid parameters
                    if(row <= size && column <= size && row > 0 && column > 0) {
                        return board[row * size + column]
                    }
                    else {
                        throw new Error('Invalid arguments');
                    }
                }
            }
        };

        this.boardSize = function() {
            if(board != null)
                return Math.sqrt(board.length);
            return 0;
        };
    }

    // Statics
    constructor.makeDefaultPublicState = function() {
        return Game.ALIVE;
    };
    constructor.makeDefaultPublicBoard = function(size) {
        if(size == null || (size != (~~size)) || size <= 0)
            throw new Error('Invalid size');

        var len = size*size;
        var board = [];
        for(var i = 0; i < len; i++)
            board.push(this.makeDefaultPublicState());
        return board;
    };

    return constructor;
})();