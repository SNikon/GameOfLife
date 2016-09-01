/**
 * Created by pi on 29/07/16.
 */

'use strict';

(function () {
    describe('html display', function() {
        describe('initialization', function() {
            beforeAll(function() {
                this.rootFixtureID = 'canvas-holder';
                this.rootFixture = '<div id="' + this.rootFixtureID + '">'; // eventually, have element
            });

            beforeEach(function () {
                this.game = jasmine.createSpyObj(['tick', 'state']);
                this.display = new GameCanvasOutput();

                jasmine.getFixtures().set(this.rootFixture);
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

                var el = $('#'+that.rootFixtureID);
                expect(el).toBeInDOM();
                expect(el).toContainElement('canvas');
                expect(that.display.getTarget()).toBeInDOM();
            });
        });
        describe('tick', function() {
            beforeAll(function() {
                this.rootFixtureID = 'canvas-holder';
                this.rootFixture = '<div id="' + this.rootFixtureID + '">'; // eventually, have element
            });

            beforeEach(function () {
                jasmine.getFixtures().set(this.rootFixture);

                this.game = jasmine.createSpyObj(['tick', 'state']);
                this.display = new GameCanvasOutput();
                this.display.init(this.rootFixtureID, this.game);

                var Canvas = $('#'+this.rootFixtureID).find('canvas')[0];
                var Context = Canvas.getContext('2d');
                spyOn(Context, 'clearRect');
                spyOn(Context, 'fillRect');
                spyOn(Context, 'beginPath');
                spyOn(Context, 'closePath');
                spyOn(Context, 'moveTo');
                spyOn(Context, 'lineTo');
                spyOn(Context, 'rect');
                spyOn(Context, 'fill');
                spyOn(Context, 'stroke');
            });

            afterEach(function () {
                this.game = null;
                this.display = null;
            });

            it('should draw the board', function() {
                var that = this;
                expect(function() {
                    that.display.tick();
                }).not.toThrow();

                expect(that.display.getTarget().getContext('2d').clearRect).toHaveBeenCalled();
            });
        });
    });
})();