var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var auth = require("./auth.js");
var routes = require('./routes.js');
var bodyParser = require('body-parser');

module.exports.init = function() {

  var ejs_msg = '';
  var ejs_class = '';

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
    // have these values yes or yes
    console.log(ejs_msg, ejs_class);
    if (!(ejs_msg && ejs_class))
    {
      ejs_msg = '';
      ejs_class = '';
    }

    res.render('login', {
        message: ejs_msg, 
        type: ejs_class
    });
  });

  // Main CRUD funtionality
  app.use('/crud', function(req, res) {
    res.render('crud-email-test');
  });

  // Token-Based Auth
  app.all('/*', auth.authenticate);

  // Backend routes
  app.use('/api', routes);

  // TODO: Should Default if logged in as admin
  app.use(['/admin', "/profile"], function(req, res) {
    res.render('home');
  });

  // Customer hub
  app.use('/home', function(req, res) {
    res.render('customerHub');
  });

  //customer account info
   app.use('/account', function(req, res) {
    res.render('userInfo');
  });

  // Warranties plan view for a customer
  app.use('/warranties', function(req, res) {
    res.render('warranties');
  });

  // Wildcard for everything else
  // Default if not logged in

  // gonna have to check for tokens in login.controller, and pass them to the next state...
  app.use('/*', function(req, res) {
    console.log("going inside general desicion");

    // console.log(req._parsedOriginalUrl.path);
    if (req._parsedOriginalUrl.path == "/") {
      if (req.data && req.data.token) {
        console.log(req.data.token);
        auth.contact(req, res, null);
      }
      else {
        // Go to login LOGIN if no VALID token data
        ejs_msg = "Your session expired. Please log in again";
        ejs_class = "alert bg-warning";
        res.redirect('/login');
      }
    }
    else {
      // Go to login LOGIN if no token data EVER
      if (true)
      {
        ejs_msg = "Please enter a valid url";
        ejs_class = "alert bg-danger";
        if (true)
          res.redirect('/login');
      }
    }
  });

  return app;
};