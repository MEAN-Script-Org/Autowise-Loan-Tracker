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

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  app.set('view engine', 'ejs');

  // serve static files
  // app.use('/client', express.static(__dirname + '/../client'));
  app.use('/', express.static(__dirname + '/../client'));

  // use the listings router for requests to the api
  app.use('/api', routes);

  // load 
  app.use('/crud', function(req, res) {
    res.render('crud-email-test');
  });

  // go to homepage for all routes not specified
  app.all('/*', function(req, res) {
    res.render('home');
  });

  return app;
};