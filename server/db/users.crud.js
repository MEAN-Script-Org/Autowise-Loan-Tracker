// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var User = require('./users.model.js') ;

module.exports = {

  create: function(req, res) {
    var newUser = new User(req.body);

    newUser.save(function(err) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      } else res.json(newUser) ;
    });
  },

  read: function(req, res) {
    res.json(req.user) ;
  },

  // TODO: Make single view THAT FUCKING TAKES IN PARAMETERS!!
  // for /crud/:id => render request, then do a factory call for that ID, done!
  // I want to go to a specific user...
  // Scrap this thing. needs to be on in the 'express' area
  // display: function(req, res) {
  //     res.redirect('/crud/' + req.user._id);
  // },

  update: function(req, res) {
    var oldUser = req.user;
    // console.log(req.body);

    // Replace old user's properties with the newly sent ones
    var userToBeUpdated = Object.assign(oldUser, req.body, function(former, replacement){
      if (!replacement) return former;
      else return replacement;
    });
    
    // {new: true} => Returns the real/actual updated version
    //             => 'updatedUser'
    User.findByIdAndUpdate(oldUser._id, userToBeUpdated, {new: true}, 
      function(err, updatedUser) {
        if (err) res.status(404).send(err);
        else res.json(updatedUser);
    });
  },

  delete: function(req, res) {
    User.findByIdAndRemove(req.user._id, function(err) {
      if (err) res.status(404).send(err);
      else res.json(req.user);
    });
  },

  // Get all usernames
  getAll: function(req, res) {
    // add logic here for only usernames
    User.find({}, function(err, users) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else {
        var user_names = [];
        
        users.forEach(function(item, index) {
          user_names.push(item.username);
        })

        res.json(user_names) ;
      }

    });
  },

  userByID: function(req, res, next, id) {
    User.findById(id).exec(function(err, user) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      }
      else {
        req.user = user;
        next() ;
      }
    });
  }
};