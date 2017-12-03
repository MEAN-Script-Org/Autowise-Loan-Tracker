// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var User = require('./users.model.js') ;

module.exports = {

  create: function(req, res, next) {
    var newUser = new User({
      dl: req.body.dl,
      dob: req.body.dob,
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      username: req.body.username,
      password: req.body.password,
      isSuperAdmin: req.body.isSuperAdmin,
    });

    if (req.body.username && req.body.password) {
      newUser.save(function(err, realNewUser) {

        if (err) {
          if (err.toJSON().code == 11000) {
            res.json({ 
              err,
              message: 'Username or email already exist!' ,
            }); 
          }
          else {
            console.log(err);
            res.json({ 
              message: err
            });
          } 
        } else {
          console.log(realNewUser);
          req.new = newUser;
          next();
        }
      });
    } else {
      res.json({ error: 'Ensure username, email or password was provided' });
    }
  },

  read: function(req, res) {
    // console.log(req.body.token);
    res.json(req.body.token);
  },

  update: function(req, res) {
    var oldUser = req.user;
    // console.log(req.body);

    // Replace old user's properties with the newly sent ones
    var userToBeUpdated = Object.assign(oldUser, req.body);
    
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
    // console.log(users);
    
    var user_names = [];
    users.forEach(function(item, index) {
      user_names.push(item.username);
    })
    res.json(user_names) ;
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
  },

  affixLoans: function(req, res, next) {
    // Affixing possible already existing loans
    // given a new loan, attach loan to (co)purchaser customers

    var p = req.new.buyers_order.purchaser;
    var cop = req.new.buyers_order.copurchaser;
    var wanted_id = req.new.id;
    var temp_users = [];

    // TODO LATEEERRR: Use DLs too
    var query = {
      name: p.name,
      dob: new Date(p.dob).toLocaleDateString('es-PA'),
    };

    var all_qs = [query];

    if (cop.name && cop.dob) {
      var co_query = {
        name: cop.name,
        dob: new Date(cop.dob).toLocaleDateString('es-PA'),
      };

      all_qs.push(co_query);
    }

    // TODO: Test this!
    // Find all users according to the query, affix this user's id to them
    User.find({$or: all_qs}).exec(function(err, users) {
      console.log(loans.length);

      if (err) console.log(err);
      else {
        // Update found users with loan ID
        users.forEach(function(user) {
          temp_users.push(user._id);
          user.loans.push(req.new.id);

          User.findByIdAndUpdate(user._id, user, {new: true}).exec();
        });
        var new_users = {user_ids: temp_users};

        // update loan
        Loan.findByIdAndUpdate(req.new.id, new_users, {new: true}).exec(
          function(err, updated) {
            console.log("DALE!", updated);
            next();
        });
      }
    });
  },
};