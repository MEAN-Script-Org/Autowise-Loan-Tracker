var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var auth = require("./auth.js");
var api_routes = require('./routes.js');

var users = require("./db/users.crud.js") ;
var loans = require('./db/loans.crud.js') ;

var ejs_msg = '';
var ejs_class = '';

//----------------------------------------------------------------------------------------------------------------------
// PROFILE ROUTING
//======================================================================================================================

// Reroute logic *nessesarily ugly&
var profile_routes = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// User (admin and customer) home/hub routing
//----------------------------------------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------------------------------------
// Customer warranty plans routing
//----------------------------------------------------------------------------------------------------------------------
profile_routes.route('/warranties/:loan_id/:token')
.all(function(req, res) {
  var token = req.body.token;
  var loan = req.loan;
  
  console.log("WARRANTIES ROUTER: ");
  console.log(token) ;
  console.log(loan) ;
  
  // Missing/invalid token handling => redirect to login page
  if (!token) {
    ejs_msg = "Your session expired. Please log in again";
    ejs_class = "alert bg-warning";
    res.redirect('/login');
  } else if (token == "nothing ever") {
    ejs_msg = "Please log in to access your profile";
    ejs_class = 'alert bg-danger';
    res.redirect("/login");
  
  // Render warranties page
  } else {
    res.render("warranties", {path: "../../../"});
  }
});

profile_routes.param('loan_id', loans.loanByID);
profile_routes.param('token', auth.decodeToken);

//----------------------------------------------------------------------------------------------------------------------
// LOGIN ROUTING
//======================================================================================================================
var login_routes = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Login page routing
//----------------------------------------------------------------------------------------------------------------------
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

// Marcial:
// End of ugly (but needed) routes
// I did it this way in order to reroute back to login with a message

//======================================================================================================================
// Rest of the routing
//======================================================================================================================
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

  //customer account info
   app.use('/account', function(req, res) {
    res.render('userInfo', {path: ''});
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