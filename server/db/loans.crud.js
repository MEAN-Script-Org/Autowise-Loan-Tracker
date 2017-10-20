// This file details CRUD functionality of the loan database object
// Repurposed Assignment 3, might need to look better into it

var mongoose = require('mongoose') ;
var Loan = require('./loans.model.js') ;

// Saves a loan to the database and responds with the database loan object in JSON
function save_n_respond(loan, res) {
  loan.save(function(err) {
    if (err) {
      res.status(400).send(err) ;
    } else {
      Loan.find(loan, function(err, loans) {
        if (err) {
          res.status(400).send(err) ;
        } else { res.status(200).json(loans[0]) ; }
      });
    }
  });
}

module.exports = {
  // Loan creation
  create: function(req, res) {
    save_n_respond(new Loan(req.body), res) ;
  },

  // Loan read
  read: function(req, res) {
    res.json(req.loan) ;
  },

  // Loan update
  update: function(req, res) {
    var loan = req.loan ;
    
    // Exhaustively update fields from HTTP request
    loan.status = req.body.status
    loan.types = req.body.types
    loan.trades = req.body.trades
    loan.comments = req.body.comments
    
    if (req.body.costs) {
      loan.costs.taxes = req.body.costs.taxes
      loan.costs.warranties = req.body.costs.warranties
    }
    
    save_n_respond(loan, res) ;
  },

  // Loan deletion
  delete: function(req, res) {
    var loan = req.loan ;
    
    // Find the loan of interest
    Loan.find(loan, function(err, loans) {
      if (err) {
        res.status(404).send(err) ;
      } else {
        // TODO: Correctly implement this
        // since this is wrong, can't use hardcoded index
        loans[0].remove(function(err) {
          if (err) {
            res.status(404).send(err) ;
          } else res.json(loans) ;
        }) ;
      }
    });
  },

  // Get all loans
  list: function(req, res) {
    Loan.find().exec(function(err, loans) {
      if (err) {
        res.status(404).send(err) ;
      } else res.json(loans) ;
    });
  },

  // Get a loan by ID
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