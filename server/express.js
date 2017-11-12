var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var auth = require("./auth.js");
var routes = require('./routes.js');
var bodyParser = require('body-parser');

module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

  // initialize app
  var app = express();

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  app.use('/', express.static(__dirname + '/../client'));

  // DO NOT PERFORM AUTH ON SERVER SIDE BY DEFAULT
  app.use('/login', function(req, res) {
    res.render('login');
  });

  // Main CRUD funtionality
  app.use('/crud', function(req, res) {
    res.render('crud-email-test');
  });

  // General Auth
  app.all('/*', auth.authenticate);

  // use this router for requests to the api
  app.use('/api', routes);

  // TODO: Should Default if logged in as admin
  app.use(['/admin', "/profile"], function(req, res) {
    res.render('home');
  });

  // Warranties plan view for a client
  app.use('/warranties', function(req, res) {
    res.render('warranties');
  });

  // TODO: Should Default if NOT logged in as user
  // Wildcard for everything else
  // Default if not logged in
  // DO NOT PERFORM AUTH ON SERVER SIDE BY DEFAULT
  app.use('/', function(req, res) {
    // go to login LOGIN if no token
    console.log("going inside general desicion");
    if (req.data){
      if (req.data.token) {
        console.log(req.data.token);
        auth.contact(req, res, null);
      }
      else
        res.redirect('/login');
    }
    else 
      res.redirect('/login');
  });

  // app.use(['/', '/*'], function(req, res) {
  // app.use('/*', function(req, res) {
  //   with params: "invalid page"
  //   res.redirect('/login');
  // });

  return app;
};