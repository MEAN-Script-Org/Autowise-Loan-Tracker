'use strict';

var bs = require('browser-sync');
var gulp = require('gulp');
var clear = require('clear');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');
var config_loader = require('dotenv');

var locals = config_loader.load();

gulp.task('default', ['get-config', 'nodemon', 'browser-sync',]);
// can i pass flags to this?? 
// so i can start in a specific page...

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

function load_frontend() {
    console.log('-------- Starting BS --------');
    bs.reload();
}

gulp.task('nodemon', function (cb) {
    var started = false;
    var reloaded = false;
    return nodemon({
        env: locals
    })
    .on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }

        if (!load_frontend()) {
            load_frontend();
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