/**
 * Created by pi on 29/07/16.
 */

'use strict';

(function () {
    describe('html display', function() {
        describe('initialization', function() {
            beforeAll(function() {
                this.rootFixtureID = 'canvas-holder';
                this.rootFixture = ''; // eventually, have element
            });

            beforeEach(function () {
                this.game = {};
                this.display = new GameCanvasOutput();
            });

            afterEach(function () {
                this.game = null;
                this.display = null;
            });

            it('should throw if parameters are not passed as expected', function () {
                var that = this;
                expect(function() {
                    that.display.init();
                }).toThrow();
                expect(function() {
                    that.display.init(null, this.game)
                }).toThrow();
                expect(function() {
                    that.display.init(that.rootFixtureID, null)
                }).toThrow();
            });
            it('should present the canvas', function () {
                var that = this;
                expect(function() {
                    that.display.init(that.rootFixtureID, that.game);
                }).not.toThrow();
                expect(function() {

                })
            });
        });
        describe('tick', function() {
            beforeEach(function () {
                this.game = {};
                this.display = new GameCanvasOutput();
            });

            afterEach(function () {
                this.game = null;
                this.display = null;
            });

            it('should draw the board', function() {
                expect(false).toBeTruthy();
            });
        });
    });
})();