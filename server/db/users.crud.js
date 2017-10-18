// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
var User = require('./users.model.js') ;

// Saves a user to the database
function save(user, res) {
  user.save(function(err) {
    if(err) {
      console.log(err) ;
      res.status(400).send(err) ;
    } else res.status(200) ;
  });
}

module.exports = {
  // User creation
  create: function(req, res) {
    save(new User(req.body), res) ;
  },

  // Loan read
  read: function(req, res) {
    res.json(req.user) ;
  },

  // User update
  update: function(req, res) {
    var user = req.user ;
    
    // Update individual fields
    save(user, res) ;
  },

  // User deletion
  delete: function(req, res) {
    var user = req.user ;
    
    User.find(user, function(err, users) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else {
        // TODO: Correctly implement this
        // since this is wrong, can't use hardcoded index
        users[0].remove(function(err) {
          if (err) {
            console.log(err) ;
            res.status(404).send(err) ;
          } else res.json(users[0]) ;
        });
      }
    });
  },

  // Get all users
  list: function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(users) ;
    }) ;
  },

  // Get a user by ID
  userByID: function(req, res, next, id) {
    User.findById(id).exec(function(err, user) {
      if(err) { res.status(400).send(err) ; }
      else {
        req.user = user ;
        next() ;
      }
    });
  },
};