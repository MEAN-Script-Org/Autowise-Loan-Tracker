// This file details CRUD functionality of the loan database object
// Repurposed Assignment 3, might need to look better into it

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Loan = require('./loans.model.js');

// strategy ... create the comment content on the frontend... bye!
function automatedComment(comment) {
  var newComment = {
    admin: true,
    writer: {
      name : "System",
    },
    content: comment,
    newtime: new Date(),
  };

  return newComment;
};

module.exports = {

  create: function(req, res) {
    var newLoan = new Loan(req.body);

    // Add a new comment to the loan saying who made it
    var user = req.body.token;
    var firstComment = user.name + " created this loan";
    newLoan.comments = [automatedComment(firstComment)];
    // !(insurance.company && insurance.policy_no)
    // etc etc.. add another comment and change status??

    newLoan.save(function(err, realNewLoan) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else res.json(realNewLoan);
    });
  },

  read: function(req, res) {
    res.json(req.loan);
  },

  // every time there's an update, add a comment!
  // (that's not a comment itself)
  update: function(req, res) {
    var oldLoan = req.loan;

    if (req.body.note) {
      var newComment = automatedComment(req.body.note);
      if (!req.body.comments) {
        req.body.comments = []
        req.body.comments.push(newComment);
      }
      else
        req.body.comments.push(newComment);
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
    // Query loans with matching information and send them in a JSON response
    Loan.find({user_ids: req.body.token.id },
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
          res.status(400).send(err);
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
};