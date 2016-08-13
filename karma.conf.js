/**
 * Created by Nikon on 13/08/2016.
 */
module.exports = function(config) {
    config.set({
        basePath: '../..',
        preprocessors: {
            './js/**/*': ['jshint']
        },
        frameworks: ['jasmine'],
        browsers: [], // None by default
        exclude: [],
        files: [
            './js/**/*',
            './specs/**/*'
        ],
        reporters: ['progress'],

    })
}