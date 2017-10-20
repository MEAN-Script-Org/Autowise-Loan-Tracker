var express = require('./express');
var request = require('supertest');
var mongoose = require('mongoose');

module.exports.start = function() {
  var port = (process.env.PORT || 5000);
  var app = express.init();
  
  app.listen(port, function() {
    console.log('Node app is running on port', port);
  });
  
  // test_loan_database(app) ;
};