'use strict';

var bs = require('browser-sync');
var gulp = require('gulp');
var exec = require('child_process').exec;
var clear = require('clear');
var nodemon = require('gulp-nodemon');
var config_loader = require("dotenv-safe");

// gulp.task('default', seq);
gulp.task('default', ['import-heroku-config', 'nodemon', 'browser-sync']);

gulp.task('import-heroku-config', function(callback) {
    exec("heroku config -s > .env.example");
    callback();
});

// Doc: https://browsersync.io/docs/options
gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        // browser: "firefox"
        browser: "chrome",
        reloadOnRestart: true,
        files: ["client/**/*.*"],
        proxy: "http://localhost:5000",
        port: "5001",
    });
});

gulp.task('nodemon', function (callback) {
    var started = false;
    return nodemon({
        env: config_loader.load().parsed
    })
    .on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            started = true;
            callback();
        } 
    })
    .on('restart', function() {
        clear();
        console.log('-------- Restarting Server --------');
    })
    .on('crash', function() {
        clear();
        console.log('-------- APP CRASHED! Make sure you have valid Heroku credentials --------');
        console.log("-------- Type 'rs' [enter] on THIS command line to RESTART server --------");
        console.log('-------- Restarting browser-sync --------');
        bs.reload();
    });
});