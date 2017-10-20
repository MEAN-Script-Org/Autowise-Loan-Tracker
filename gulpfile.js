'use strict';

var gulp = require('gulp');
var bs = require('browser-sync');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');

gulp.task('default', ['import-heroku-config', 'nodemon', 'browser-sync']);

gulp.task('import-heroku-config', function() {
    exec("heroku config -s > .env");
});

gulp.task('browser-sync', function() {
    bs.init(null, {
        proxy: "http://localhost:5000",
        port: "5001",
        files: ["client/**/*.*"],
        browser: "chrome"
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({env: { 'NODE_ENV': 'development' }})
    .on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }

        setTimeout(function() {
            console.log('-------- Restarting browser-sync --------');
            bs.reload();
        }, 1000);
    })
    .on('crash', function() {
        console.log('-------- APP CRASHED! MAKE SURE YOU HAVE VALID HEROKU CREDENTIALS --------');
    });
});