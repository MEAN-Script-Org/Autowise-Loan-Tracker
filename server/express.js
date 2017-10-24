var routes = require('./routes.js');
var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// This var needs to go asap
// This was replaced by .env variable 'MONGO_URI' in Heroku
// var db_config = require('./server.db_config.js') ;

module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

  // initialize app
  var app = express();
  // app.all('/api/*', requireAuthentication);
  // app.all('/admin/*', requireAuthentication, requireAdminStatus);

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  app.use('/', express.static(__dirname + '/../client'));

  // use this router for requests to the api
  app.use('/api', routes);
  // app.use('/loans', routes);

  // Marcial work
  app.use('/crud', function(req, res) {
    res.render('crud-email-test');
  });

  // Default if not logged in
  app.use('/login', function(req, res) {
    res.render('login');
  });

  // Default if logged in
  app.use('/loans', function(req, res) {
    res.render('user');
  });

  app.use('/admin', function(req, res) {
    res.render('home');
  });

  // Wildcard
  app.use('/*', function(req, res) {
    res.redirect('login');
  });

  // if (req.accepts('html')) {
  // if (req.accepts('json')) {
  
  return app;
};