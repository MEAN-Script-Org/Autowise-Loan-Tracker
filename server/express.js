var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var api_routes = require('./routes.js');
var users = require("./db/users.crud.js") ;
var auth = require("./auth.js");

var ejs_msg = '';
var ejs_class = '';

// Reroute logic *nessesarily ugly&
var profile_routes = express.Router();

profile_routes.route('/:token').all(
  function(req, res) {
    // next page routing based on token status and admin
    var token = req.body.token;

    if (!token) {
      ejs_msg = "Please log in to access your profile";
      ejs_class = 'alert bg-danger';
      res.redirect("/login");
    }
    else if (token == "nothing ever") {
      ejs_msg = "Your session expired. Please log in again";
      ejs_class = "alert bg-warning";
      res.redirect('/login');
    }
    else if (token.isAdmin)
      res.render("admin", {path: "../"});
    else
      res.render("customerHub", {path: "../"});
});

profile_routes.param('token', auth.decodeToken);

// profile_routes.route('/:token/warranty')
//               .get()
//               .post()
//               ;

var login_routes = express.Router();
login_routes.route("/")
  .get(function(req, res) {
    // console.log(ejs_msg, ejs_class);

    // have these values yes or yes
    console.log("rendering...");
    res.render('login', {
        message: ejs_msg,
        type: ejs_class,
        path: ''
    });

    ejs_msg = '';
    ejs_class = '';
  })
  .post(auth.login);

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
  app.use(bodyParser.urlencoded({extended: true}));

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  app.use('/', express.static(__dirname + '/../client'));

  // User CRUD funtionality
  app.use('/crud', function(req, res) {
    res.render('crud-email-test', {path: ''});
  });

  // Customer hub
  app.use('/home', function(req, res) {
    res.render('customerHub', {path: ''});
  });

  // Warranties plan view for a customer
  // why the hell does it take 4 reqs to do this??
  app.use('/warranties', function(req, res) {
    res.render('warranties', {path: ''});
  });

  // DO NOT PERFORM AUTH ON SERVER SIDE BY DEFAULT
  app.use('/login', login_routes);

  // automatic reroute here
  app.use('/profile', profile_routes);

  // TODO: Add master admin hardcoded link (Harrisons work)
  app.use('/perm', function(req, res) {
    res.render('changePermissions', {path: ''});
  });

  // TODO: Add master admin hardcoded link (Harrisons work)
  app.use('/admin', function(req, res) {
    res.render("admin", {path: "../"});
  });

  // ALLOW non-logged in to retrieve usernames, and create new profiles
  app.use('/usernames', users.getAll, users.getAllUsernames);
  app.use('/new', users.create, auth.login);

  // Token-Based Auth
  // Backend API routes
  app.use('/api', auth.authenticate, api_routes);

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