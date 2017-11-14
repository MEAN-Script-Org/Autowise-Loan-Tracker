var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var auth = require("./auth.js");
var routes = require('./routes.js');
var bodyParser = require('body-parser');

var ejs_msg = '';
var ejs_class = '';

// Reroute logic *nessesarily ugly&
var profile_routes = express.Router();

profile_routes.route('/:token')
.get(function(req, res) {
  var token = req.token;
  
  // next page routing based on token status and admin
  if (!token) {
    ejs_msg = "Your session expired. Please log in again";
    ejs_class = "alert bg-warning";
    res.redirect('/login');
    
  }
  else if (token == "nothing ever") {
    ejs_msg = "Please log in to access your profile";
    ejs_class = 'alert bg-danger';

    res.redirect("/login");
  }
  else if (token.isAdmin)
    res.render("admin", {path: "../"});
  else
    res.render("admin", {path: "../"});
});

profile_routes.param('token', auth.decodeToken);

// profile_routes.route('/:token/warranty')
//               .get()
//               .post()
//               ;
// End of ugly (but needed) routes

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
  app.get('/login', function(req, res) {
    // console.log(ejs_msg, ejs_class);

    // have these values yes or yes
    res.render('login', {
        message: ejs_msg,
        type: ejs_class,
        path: ''
    });

    ejs_msg = '';
    ejs_class = '';
  });

  app.post('/login', auth.login);

  // Main CRUD funtionality
  app.use('/crud', function(req, res) {
    res.render('crud-email-test', {path: ''});
  });

  // Customer hub
  app.use('/home', function(req, res) {
    res.render('customerHub', {path: ''});
  });

  // Warranties plan view for a customer
  app.use('/warranties', function(req, res) {
    res.render('warranties', {path: ''});
  });

  // automatic reroute here
  app.use('/profile', profile_routes);

  // TODO: Add master admin hardcoded link (Harrisons work)

  // Token-Based Auth
  // Backend API routes
  app.use('/api', auth.authenticate, routes);

  // Wildcard for everything else
  app.use('/*', function(req, res) {
      if (req._parsedOriginalUrl && req._parsedOriginalUrl.path != "/") {
        ejs_msg = "Please enter a valid URL";
        ejs_class = "alert bg-danger";
      }
      res.redirect('/login');
  });

  return app;
};