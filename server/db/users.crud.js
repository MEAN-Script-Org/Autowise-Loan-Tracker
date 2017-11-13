// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var User = require('./users.model.js') ;

module.exports = {

  create: function(req, res) {
    var newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    if (req.body.username && req.body.password) {
      newUser.save(function(err, realNewUser) {
        // console.log(err, realNewUser);

        if (err) {
          // non-unique
          if (err.toJSON().code == 11000) {
            res.json({ 
              err,
              message: 'Username or email already exist!' ,
            });
          }
          else {
            res.json({ 
              message: err
            });
          } 
        } else {
          res.redirect("/crud");
          // res.json(newUser);
          // res.json({ message: 'User created!' });
          // TODO: user_decision route... either admin or general user
          // Also add frontend and f(x)ity
        }
      });
    } else {
      res.json({ error: 'Ensure username, email or password was provided' });
    }
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

  returnUsers: function(req, res) {
    res.json(req.users);
  },

  // Get all user data
  getAll: function(req, res, next) {
    // add logic here for only usernames
    User.find({}, function(err, users) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else {
        if (typeof next === "function") {
          req.users = users;
          next();
        }
        else {
          console.log("something's off! check users.getAll");
        }
      }
    });
  },

  // Get all user names
  // TODO: maybe leave to frontend
  getAllUsernames: function(req, res, data) {
    var users = req.users;
    var user_names = [];
    users.forEach(function(item, index) {
      user_names.push(item.username);
    })
    res.json(user_names) ;
  },
  
  userByID: function(req, res, next, id) {
    
    // TEST: replace with database query once Users are implemented properly
    req.user = {user_id: id} ;
    next() ;
    return ;
    
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