// This file details CRUD functionality of the loan database object
// Repurposed Assignment 3, might need to look better into it

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Loan = require('./loans.model.js');
var User = require('./users.model.js');

// strategy ... create the comment content on the frontend... bye!
function automatedComment(comment, isAdmin) {
  var newComment = {
    admin: isAdmin,
    writer: {
      name : "System",
    },
    content: comment,
    newtime: new Date(),
  };

  return newComment;
};

module.exports = {

  create: function(req, res, next) {
    var newLoan = new Loan(req.body);

    // Add a new comment to the loan saying who made it
    var user_t = req.body.token;
    var firstComment = user_t.name + " created this loan";
    newLoan.comments = [automatedComment(firstComment)];
    // !(insurance.company && insurance.policy_no)
    // etc etc.. add another comment and change status??
    // newLoan.comments.push(automatedComment(firstComment));

    newLoan.save(function(err, realNewLoan) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } 
      else {
        // res.json(realNewLoan);
        req.new = realNewLoan;
        next();
      }
    });
  },

  read: function(req, res) {
    res.json(req.loan);
  },

  // every time there's a note, add a comment!
  // (that's not a comment itself)
  update: function(req, res) {
    var oldLoan = req.loan;

    if (req.body.note) {
      var newComment = automatedComment(req.body.note, req.body.isAdminNote);
      req.body.comments = [newComment]
     
      // // if more than 1
      // if (req.body.notes) {
      //   req.body.note.forEach(function(item) {
      //     var newComment = automatedComment(item, req.body.isAdminNote);
      //     req.body.comments.push(newComment);
      //   })
      // }
      // else {
      //   // current implementation
      // }
    }
      
    // Replace old loan's properties with the newly sent ones
    var loanToBeUpdated = Object.assign(oldLoan, req.body);

    // {new: true} => Returns the real/actual updated version
    //             => 'updatedLoan'
    Loan.findByIdAndUpdate(oldLoan._id, loanToBeUpdated, { new: true },
      function(err, updatedLoan) {
        if (err) res.status(404).send(err);
        else res.json(updatedLoan);
      });
  },

  //--------------------------------------------------------------------------------------------------------------------
  // Deletes a load of the specified ID
  //--------------------------------------------------------------------------------------------------------------------
  delete: function(req, res) {
    Loan.findByIdAndRemove(req.loan._id, function(err) {
      if (err) res.status(404).send(err);
      else res.json(req.loan);
    });
  },

  //--------------------------------------------------------------------------------------------------------------------
  // Get all loans
  //--------------------------------------------------------------------------------------------------------------------
  getAll: function(req, res) {
    Loan.find({}, function(err, loans) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } 
      else res.json(loans);
    });
  },

  //--------------------------------------------------------------------------------------------------------------------
  // Get all loans belonging to a particular user (based on ID)
  //--------------------------------------------------------------------------------------------------------------------
  loansByUserID: function(req, res, next) {
    // console.log("USER ID:") ;
    // console.log(req.body.token.id) ;
    
    // Query loans with matching information and send them in a JSON response
    Loan.find({user_ids: { $all: [req.body.token.id] }},
      function(err, loans) {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else res.json(loans);
    });
  },

  //--------------------------------------------------------------------------------------------------------------------
  // Get a loan of the specified ID
  //--------------------------------------------------------------------------------------------------------------------
  loanByID: function(req, res, next, id) {
    if (id) {

      Loan.findById(id).exec(function(err, loan) {
        if (err) {
          console.log(err);
          // res.status(400).send(err);
          res.redirect("/profile/"+req.body.old_token);
        } else {
          req.loan = loan;
          next();
        }
      });

    } else {
      console.log("NO IDDDD");
      console.log(req.body, req.body.token);
    }
  },

  affixUsers: function(req, res, next) {
    // Affixing possible already existing loans
    var temp_loans = [];
    var wanted = {
      id: req.new.id,
      dob: new Date(req.new.dob).toLocaleDateString('es-PA'),
      name: req.new.name,
    };

    // TODO LATEEERRR: Use DLs too
    var query = {
      "buyers_order.purchaser.name": wanted.name,
      "buyers_order.purchaser.dob": wanted.dob,
    };

    var co_query = {
      "buyers_order.copurchaser.name": wanted.name,
      "buyers_order.copurchaser.dob": wanted.dob,
    };

    // Find all loans according to the query, affix this user's id to them
    Loan.find({$or: [query, co_query]}).exec(function(err, loans) {
      // console.log(query);
      console.log(loans.length);

      if (err) console.log(err);
      else {
        // Update found loans with user ID
        loans.forEach(function(loan) {
          temp_loans.push(loan._id);
          loan.user_ids.push(req.new.id);
          
          Loan.findByIdAndUpdate(loan._id, loan, {new: true}).exec();
        });

        var new_loans = {loans: temp_loans};

        // update users
        User.findByIdAndUpdate(req.new.id, new_loans, {new: true}).exec(
          function(err, updated) {
            console.log("DALE!", updated);
            // User.findByIdAndRemove(req.new.id).exec();
            next();
        });
      }
    });
  },
};