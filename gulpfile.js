'use strict';

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

<<<<<<< HEAD
gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({env: { 'NODE_ENV': 'development' }})
=======
function load_frontend() {
    console.log('-------- Starting browser-sync (frontend loader) --------');
    bs.reload();
}

gulp.task('nodemon', function (cb) {
    var started = false;
    var reloaded = false;
    return nodemon({
        env: locals,
        watch: [
            "server.js",
            "server/",
        ],

    })
>>>>>>> crud-frontend
    .on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
<<<<<<< HEAD
        setTimeout(function() {
            bs.reload();
            console.log('-------- Starting BS --------');
        }, 2000);
=======

        if (!load_frontend()) {
            load_frontend();
        }
>>>>>>> crud-frontend
    })
    .on('restart', function() {
        clear();
        console.log('-------- Restarting Server --------');
<<<<<<< HEAD
=======
    })
    .on('crash', function() {
        clear();
        console.log('-------- APP CRASHED! Make sure you have valid Heroku credentials --------');
        console.log("-------- Type 'rs' [enter] on THIS command line to RESTART server --------");
        load_frontend();
>>>>>>> crud-frontend
    });
});