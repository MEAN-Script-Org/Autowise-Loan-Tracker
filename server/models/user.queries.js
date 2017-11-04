/* Fill out these functions using Mongoose queries*/

var fs = require('fs'),
    mongoose = require('mongoose'), 
    Schema = mongoose.Schema, 
    User = require('./user.loan.model.js'), 
    config = require('./config.js');

/* Connect to your database */

mongoose.connect(config.db.uri, {useMongoClient : true});

var newUser = new User({
  username: 'Michael',
  password: 'password',
  isAdmin: false
  


});


var newUser2 = new User({
  username: 'Max',
  password: 'password',
  isAdmin: true



});



newUser();
newUser2();






