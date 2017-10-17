var express = require('./express');
var request = require('supertest');
var mongoose = require('mongoose');

>>>>>>> 60066ff3fcf2725504fc8d7cd0c93aabb1e0e71c
module.exports.start = function() {
  var port = (process.env.PORT || 5000);
  var app = express.init();
  
  app.listen(port, function() {
    console.log('Node app is running on port', port);
  });
  
  //test_loan_database(app) ;
};