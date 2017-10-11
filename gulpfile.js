'use strict';

var gulp = require('gulp');
var bs = require('browser-sync');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');

gulp.task('default', ['get-config', 'nodemon', 'browser-sync']);

// gulp.task('install', ['npm', 'default']);

// gulp.task('npm', function(cb) {
//     exec("npm install -g gulp");
// });

gulp.task('get-config', function(cb) {
    exec("heroku config -s > .env");
});

gulp.task('browser-sync', function() {
    bs.init(null, {
        proxy: "http://localhost:5000",
        port: "5001",
        files: ["client/**/*.*", "public/**/*.*"],
        browser: "chrome"
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({env: { 'NODE_ENV': 'development' }})
    .on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    })
    .on('restart', function() {
        setTimeout(function() {
            console.log('-------- restart BS --------');
            bs.reload();
        }, 1000);
    });
});