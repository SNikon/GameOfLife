/**
 * Created by pi on 29/07/16.
 */

'use strict';

(function () {
    describe('game board', function () {

        describe('defaults', function() {
            it('should exist', function() {
                expect(Game.makeDefaultPublicState).toEqual(jasmine.any(Function));
                expect(Game.makeDefaultPublicBoard).toEqual(jasmine.any(Function));
            });

            it('default state should be a boolean', function() {
                expect(Game.makeDefaultPublicState()).toEqual(jasmine.any(Boolean));
            });

            it('default board should throw if invalid size is passed', function() {
                expect(function() {
                    Game.makeDefaultPublicBoard()
                }).toThrow();
                expect(function() {
                    Game.makeDefaultPublicBoard(-1)
                }).toThrow();
                expect(function() {
                    Game.makeDefaultPublicBoard(0)
                }).toThrow();
                expect(function() {
                    Game.makeDefaultPublicBoard(0.1)
                }).toThrow();
            });

            it('default board should be square', function() {
                var len1 = 1;
                var len2 = 2;
                var len10 = 10;

                var size1 = 1;
                var size2 = len2 * len2;
                var size10 = len10 * len10;

                var board1 = Game.makeDefaultPublicBoard(len1);
                var board2 = Game.makeDefaultPublicBoard(len2);
                var board10 = Game.makeDefaultPublicBoard(len10);

                expect(board1).toEqual(jasmine.any(Array));
                expect(board2).toEqual(jasmine.any(Array));
                expect(board10).toEqual(jasmine.any(Array));
                expect(board1.length).toBe(size1);
                expect(board2.length).toBe(size2);
                expect(board10.length).toBe(size10);
            })
        });

        describe('initialization', function() {
            beforeEach(function() {
                this.testBoard1= [  Game.makeDefaultPublicState()  ];
                this.testBoard2= [  Game.makeDefaultPublicState(), Game.makeDefaultPublicState(),
                    Game.makeDefaultPublicState(), Game.makeDefaultPublicState()
                ];

                this.testSize1 = 1;
                this.testSize2 = 2;

                this.game = new Game();
            });

            afterEach(function() {
                delete this.game;
            });

            it('should fail if a game board is not passed', function() {
                var that = this;
                expect(function() {
                    that.game.init();
                }).toThrow();
                expect(this.game.boardSize()).toBe(0);
            });

            it('should fail if a game board is passed with invalid states', function() {
                var board1 = [{}]; // 1x1 board
                var board2 = [null,null,null,null]; // 2x2 board
                var that = this;

                expect(function() {
                    that.game.init(board1)
                }).toThrow();
                expect(this.game.boardSize()).toBe(0);
                expect(function() {
                    that.game.init(board2)
                }).toThrow();
                expect(this.game.boardSize()).toBe(0);
            });

            it('should fail if a non square board is passed', function() {
                var board0 = []; // empty
                var board1 = [Game.makeDefaultPublicState(), Game.makeDefaultPublicState()]; // 1x2 or 2x1..
                var that = this;

                expect(function() {
                    that.game.init(board0)
                }).toThrow();
                expect(this.game.boardSize()).toBe(0);
                expect(function() {
                    that.game.init(board1)
                }).toThrow();
                expect(this.game.boardSize()).toBe(0);
            });

            it('should succeed if a valid board is passed', function() {
                var that = this;

                expect(function() {
                    that.game.init(that.testBoard1)
                }).not.toThrow();
                expect(this.game.boardSize()).toBe(this.testSize1);

                var newGame = new Game();
                expect(function() {
                    newGame.init(that.testBoard2)
                }).not.toThrow();
                expect(newGame.boardSize()).toBe(that.testSize2);
            });

            it('should fail if initialized more than once', function() {
                var that = this;

                expect(function() {
                    that.game.init(that.testBoard1)
                }).not.toThrow();
                expect(function() {
                    that.game.init(that.testBoard1)
                }).toThrow();
            });

            it('should only display public state', function() {
                var that = this;

                expect(function() {
                    that.game.init(that.testBoard2)
                }).not.toThrow();
                var newBoard = this.game.state();
                expect(newBoard).not.toBe(this.testBoard2);
                expect(newBoard).toEqual(this.testBoard2);
            })

        });

        describe('ticker', function() {
            beforeEach(function() {
                this.game = new Game();
            });

            afterEach(function() {
                this.game = null;
            });

            it('should advance the state once per tick', function() {
                var that = this;
                // var initialState = [
                //     false,  true,   false,  false,  false,
                //     false,  true,   false,  false,  false,
                //     false,  false,  false,  false,  false,
                //     false,  false,  false,  false,  false,
                //     false,  true,  false,  false,  false
                // ];
                var initialState = [
                    false,  true,   true,
                    false,  true,   false,
                    false,  false,  false
                ];
                var expectedState1 = [
                    true,   true,   true,
                    true,   true,   true,
                    true,   true,   true
                ];
                var expectedState2 = [
                    false,  false,  false,
                    false,  false,  false,
                    false,  false,  false
                ];
                this.game.init(initialState);

                expect(this.game.state()).toEqual(initialState);
                expect(function() {
                    that.game.tick()
                }).not.toThrow();
                expect(this.game.state()).toEqual(expectedState1);
                expect(function() {
                    that.game.tick()
                }).not.toThrow();
                expect(this.game.state()).toEqual(expectedState2);
            });

            it('should end the game if reached a deadlock with no changes', function() {
                var that = this;

                var initialState = [
                    false,  true,   true,
                    false,  true,   false,
                    false,  false,  false
                ];
                var expectedState1 = [
                    true,   true,   true,
                    true,   true,   true,
                    true,   true,   true
                ];
                var deadlockState1 = [
                    false,  false,  false,
                    false,  false,  false,
                    false,  false,  false
                ];
                var deadlockState2 = [
                    false,  false,  false,
                    false,  false,  false,
                    false,  false,  false
                ];

                expect(this.game.gameover()).toBeTruthy();

                expect(function() {
                    that.game.init(initialState);
                }).not.toThrow();

                expect(this.game.gameover()).toBeFalsy();

                expect(this.game.state()).toEqual(initialState);
                expect(function() {
                    that.game.tick()
                }).not.toThrow();
                expect(this.game.state()).toEqual(expectedState1);

                expect(this.game.gameover()).toBeFalsy();

                expect(function() {
                    that.game.tick()
                }).not.toThrow();
                expect(this.game.state()).toEqual(deadlockState1);

                expect(this.game.gameover()).toBeFalsy();
                expect(function() {
                    that.game.tick()
                }).not.toThrow();
                expect(this.game.state()).toEqual(deadlockState2);

                expect(this.game.gameover()).toBeTruthy();
            });

            it('should have no effect once the game is over', function() {
                var that = this;

                var deadlockState = [
                    false,  false,  false,
                    false,  false,  false,
                    false,  false,  false
                ];

                expect(this.game.gameover()).toBeTruthy();

                expect(function() {
                    that.game.init(deadlockState);
                }).not.toThrow();

                expect(this.game.gameover()).toBeFalsy();
                expect(this.game.state()).toEqual(deadlockState);

                expect(function() {
                    that.game.tick()
                }).not.toThrow();

                expect(this.game.state()).toEqual(deadlockState);
                expect(this.game.gameover()).toBeTruthy();

                expect(function() {
                    that.game.tick()
                }).not.toThrow();

                expect(this.game.state()).toEqual(deadlockState);
                expect(this.game.gameover()).toBeTruthy();

                expect(function() {
                    that.game.tick()
                }).not.toThrow();

                expect(this.game.state()).toEqual(deadlockState);
                expect(this.game.gameover()).toBeTruthy();
            });
        });

        describe('reset', function() {
            beforeEach(function () {
                this.game = new Game();
            });

            afterEach(function () {
                this.game = null;
            });

            it('should throw if the game is not initialized', function() {
                var that = this;
                expect(function() {
                    that.game.reset()
                }).toThrow(new Error('Game not initialized'));
            });

            it('should set the initial state', function () {
                var that = this;

                var initialState = [
                    false, true, true,
                    false, true, false,
                    false, false, false
                ];
                var deadlockState = [
                    false, false, false,
                    false, false, false,
                    false, false, false
                ];


                expect(function () {
                    that.game.init(initialState);
                }).not.toThrow();

                expect(function () {
                    that.game.tick();
                    that.game.tick();
                    that.game.tick()
                }).not.toThrow();

                expect(this.game.state()).toEqual(deadlockState);
                expect(this.game.gameover()).toBeTruthy();

                this.game.reset();
                expect(this.game.gameover()).toBeFalsy();
                expect(this.game.state()).toEqual(initialState);


                expect(function () {
                    that.game.tick();
                    that.game.tick();
                    that.game.tick()
                }).not.toThrow();

                expect(this.game.state()).toEqual(deadlockState);
                expect(this.game.gameover()).toBeTruthy();
            });
        })
    });
})();