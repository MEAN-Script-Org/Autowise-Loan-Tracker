// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
var User = require('../models/users.js') ;

// Saves a user to the database
function save(user, res) {
  user.save(function(err) {
    if(err) {
      console.log(err) ;
      res.status(400).send(err) ;
    } else res.status(200) ;
  });
};

// User creation
exports.create = function(req, res) {
  save(new User(req.body), res) ;
};

// Loan read
exports.read = function(req, res) {
  res.json(req.user) ;
};

// User update
exports.update = function(req, res) {
  var user = req.user ;
  
  // Update individual fields
  
  
  save(user, res) ;
};

// User deletion
exports.delete = function(req, res) {
  var user = req.user ;
  
  // Find the user of interest
  User.find(user, function(err, users) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } ;
		
    // Remove it from the database
		users[0].remove(function(err) {
			if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(users[0]) ;
		}) ;
	}) ;
};

// Get all users
exports.list = function(req, res) {
  User.find({}, function(err, users) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } else res.json(users) ;
	}) ;
};

// Get a user by ID
exports.userByID = function(req, res, next, id) {
  User.findById(id).exec(function(err, user) {
    if(err) { res.status(400).send(err) ; }
    else {
      req.user = user ;
      next() ;
    }
  });
};