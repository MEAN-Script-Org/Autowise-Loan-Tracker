var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var auth = require("./auth.js");
var api_routes = require('./api_routes.js');
var login_routes = require('./login_routes.js');
var profile_routes = require('./profile_routes.js');

var users = require("./db/users.crud.js");
var loans = require('./db/loans.crud.js');

//======================================================================================================================
// Backed routing Hub
//======================================================================================================================
module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });

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

  // TODO: finish styling this then DELETE!!
  app.use('/warranties', function(req, res) {
    res.render('warranties', { path: '' });
  });

  // DO NOT PERFORM AUTH ON ON THESE  BY DEFAULT
  // ALLOW non-logged in to:
  //   retrieve usernames
  //   create new profiles
  app.use('/', login_routes);
  app.use('/login', auth.login);

  app.use('/new', users.create, loans.affixUsers, auth.login);
  app.use('/usernames', users.getAll, users.getAllUsernames);

  // automatic reroute here
  app.use('/profile', profile_routes);

  // Token-Based Auth starts here
  // Backend API routes
  app.use('/api', auth.authenticate, login_routes.login, api_routes);

  // Wildcard for everything else
  app.use('/*', function(req, res, next) {
    req.problem = true;
    req.ejs_msg = "Please enter a valid URL";
    req.ejs_class = "alert bg-danger";
    next();
  }, login_routes.login);

  return app;
};