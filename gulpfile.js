'use strict';

var gulp = require('gulp');
var bs = require('browser-sync');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');
var clear = require('clear');

gulp.task('default', ['get-config', 'nodemon', 'browser-sync',]);

gulp.task('get-config', function(cb) {
    if (exec("heroku config -s > .env"))
        cb();
});

gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        port: "5001",
        proxy: "http://localhost:5000",
        files: ["client/**/*.*"],
        reloadOnRestart: true,
        browser: "chrome",
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
            bs.reload();
            console.log('-------- Starting BS --------');
        }, 2000);
    })
    .on('restart', function() {
        clear();
        console.log('-------- Restarting Server --------');
    });
});