// This file details CRUD functionality of the loan database object
// Repurposed Assignment 3, might need to look better into it

var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var Loan = require('./loans.model.js') ;

module.exports = {

  create: function(req, res) {
    var newLoan = new Loan(req.body);

    newLoan.save(function(err) {
      if (err) {
        res.status(400).send(err) ;
      } else res.json(newLoan) ;
    });
  },

  read: function(req, res) {
    res.json(req.loan) ;
  },

  update: function(req, res) {
    var id = req.loan._id;
    // console.log(req.body);

    if (req.body.new_loan) {
      // to make it work for max for now
      var loanToBeUpdated = req.body.new_loan;
      loanToBeUpdated.comments = req.body.comments;
    } else {
      var loanToBeUpdated = req.loan;
      loanToBeUpdated.comments = req.body.comments;
    }
    
    // {new: true} => Returns the real/actual updated version
    //             => 'updatedLoan'
    Loan.findByIdAndUpdate(id, loanToBeUpdated, {new: true}, 
      function(err, updatedLoan) {
        if (err) { console.log(err) ; res.status(404).send(err); }
        else res.json(updatedLoan);
    });
  },

  // technically don't need this... but...
  newComment: function(req, res) {
    // Upon successful message append, update
    // doing it this way to catch for asynchronous errors
    if (req.loan.comments.push(req.body.newComment))
      module.exports.update(req, res);
  },

  delete: function(req, res) {
    Loan.findByIdAndRemove(req.loan._id, function(err) {
      if (err) res.status(404).send(err);
      else res.json(req.loan);
    });
  },

  getAll: function(req, res) {
    Loan.find({}, function(err, loans) {
      if (err) {
        res.status(404).send(err) ;
      } else res.json(loans) ;
    });
  },

  loanByID: function(req, res, next, id) {
    Loan.findById(id).exec(function(err, loan) {
      if (err) {
        res.status(400).send(err) ;
      }
      else {
        req.loan = loan;
        next() ;
      }
    });
  }
};