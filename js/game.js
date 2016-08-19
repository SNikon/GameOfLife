/**
 * Created by pi on 29/07/16.
 */

var Game = (function() {
    "use strict";

    // Private static functions

    function _makeNeighbourIndexArray(index, size) {
        var row = ~~(index / size);
        var col = index % size;

        var prevRow = row > 0 ? row - 1 : size - 1;
        var nextRow = row < (size - 1) ? row + 1 : 0;
        var prevCol = col > 0 ? col - 1 : size - 1;
        var nextCol = col < (size - 1) ? col + 1 : 0;

        return  [   [prevRow, prevCol],
            [prevRow, col],
            [prevRow, nextCol],
            [row, prevCol],
            [row, nextCol],
            [nextRow, prevCol],
            [nextRow, col],
            [nextRow, nextCol]
        ].map(function(pos) {
            return pos[0] * size + pos[1]
        });
    }

    function _makeLivingNeighbours(board, index, size) {
        return _makeNeighbourIndexArray(index, size).map(function(idx) {
            return board[idx];
        }).filter(function(territory) {
            return territory.state === constructor.ALIVE;
        });
    }

    function _makeTerritoryFromPublic(rootBoard, index, size) {
        return {
            state: rootBoard[index], // Public state is a boolean
            row: ~~(index / size),
            column: (index % size),
            neighbours: []
        };
    }

    function _copyBoard(board) {
        return board.map(function(territory) {
            return {
                row: territory.row,
                column: territory.column,
                state: territory.state,
                neighbours: territory.neighbours.slice()
            }
        });
    }

    function _makeDefaultRules() {
        return [
            {
                // Any live territory with less than 2 live neighbours dies from underpopulation,
                // Any live territory with more than 3 live neighbours dies from overpopulation
                on: constructor.ALIVE,
                changeCondition: function (territory) {
                    return territory.neighbours.length < 2 || territory.neighbours.length > 3;
                }
            }, {
                // Any dead territory with exactly 3 live neighbours becomes alive
                on: constructor.DEAD,
                changeCondition: function (territory) {
                    return territory.neighbours.length === 3;
                }
            }
        ];
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
        var initialBoard = null;
        var board = null;
        var size = 0;
        //var rules = [];
        var livingRules = [];
        var deadRules = [];
        var toProcess = [];
        var end = true;

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

                var valid = true;
                board = rootBoard.map(function(publicState, index) {
                    if(typeof publicState != 'boolean') {
                        valid = false;
                        // Invalid state, just don't do anything
                        return null;
                    }

                    return _makeTerritoryFromPublic(rootBoard, index, sqrt);
                });

                if(!valid) {
                    board = null;
                    throw new Error('Invalid state in board');
                }

                initialBoard = _copyBoard(board); // Keep a copy
                size = sqrt;
                end = false;

                board.forEach(function(territory, index) {
                    territory.neighbours = _makeLivingNeighbours(board, index, size);
                });

                var rules = _makeDefaultRules();
                rules.forEach(function(rule) {
                    if(rule.on === constructor.ALIVE)
                        livingRules.push(rule);
                    else
                        deadRules.push(rule);
                });

                toProcess = board.filter(function(territory) {
                    // Currently alive
                    return (territory.state === constructor.ALIVE) ||
                        // Or dead and about to change next stage
                        deadRules.some(function(rule) {
                            return rule.changeCondition(territory);
                        });
                });
            } else {
                throw new Error('Board must be square')
            }
        };

        this.state = function(row, column) {
            if(board != null) {
                if ((row == null && column == null) || (row != null && column != null)) {
                    if (row == null) // No slot requested, return the board
                        return board.map(function (territory) {
                            return territory.state;
                        }); // Only information about being dead or alive, internal states are hidden
                    else {
                        // Valid parameters
                        if (row <= size && column <= size && row > 0 && column > 0)
                            return board[row * size + column].state;
                        else
                            throw new Error('Invalid arguments');
                    }
                }
            }
            throw new Error('Game not initialized');

        };

        this.tick = function() {
            if(!end) {
                // A (deep) copy of the board is made so that new states don't affect the current tick
                var newBoard = _copyBoard(board);
                var newToProcess = [];
                // For each territory check the conditions to change state in the PREVIOUS board and update in the NEW board
                toProcess.forEach(function (territory) {
                    var changed = territory.state === constructor.DEAD || livingRules.some(function (rule) {
                        return rule.changeCondition(territory);
                    });
                    var currentTerritoryIndex = territory.row * size + territory.column;
                    if (changed) {
                        newBoard[currentTerritoryIndex].state = (territory.state === constructor.ALIVE ? constructor.DEAD : constructor.ALIVE);
                        _makeNeighbourIndexArray(currentTerritoryIndex, size).forEach(function (neighbourIndex) {
                            newBoard[neighbourIndex].neighbours.push(newBoard[currentTerritoryIndex]);
                            var livingCondition = deadRules.some(function(rule) {
                                return rule.changeCondition(newBoard[neighbourIndex])
                            });
                            if(livingCondition)
                                toProcess.push(newBoard[currentTerritoryIndex]);
                        });
                    }
                    if(!changed && territory.state === constructor.ALIVE || changed && territory.state === constructor.DEAD)
                        newToProcess.push(newBoard[currentTerritoryIndex]);
                });
                toProcess = newToProcess;
                var anyChange = false;
                var len = board.length;
                for (var i = 0; !anyChange && i < len; i++)
                    anyChange = board[i].state !== newBoard[i].state;

                if (anyChange)
                    board = newBoard;
                else
                    end = true;
            }
        };

        this.reset = function() {
            if(initialBoard === null)
                throw new Error('Game not initialized');

            board = _copyBoard(initialBoard);
            toProcess = board.filter(function(territory) {
                return territory.state === constructor.ALIVE;
            });
            end = false;
        };

        this.gameover = function() {
            return end;
        };

        this.boardSize = function() {
            return size;
        };
    }

    // Statics
    constructor.makeDefaultPublicState = function() {
        return Game.DEAD;
    };
    constructor.makeDefaultPublicBoard = function(size) {
        if(size === null || (size !== (~~size)) || size <= 0)
            throw new Error('Invalid size');

        var len = size*size;
        var board = [];
        for(var i = 0; i < len; i++)
            board.push(this.makeDefaultPublicState());
        return board;
    };

    return constructor;
})();