// This file details CRUD functionality of the loan database object

// Dependencies
var mongoose = require('mongoose') ;
var Loan = require('../models/server.loan.model.js') ;

// Saves a loan to the database
function save(loan) {
  loan.save(function(err) {
    if(err) {
      console.log(err) ;
      res.status(400).send(err) ;
    } else res.status(200) ;
  });
};

// Loan creation
exports.create = function(req, res) {
  save(new Loan(req.body)) ;
};

// Loan read
exports.read = function(req, res) {
  res.json(req.listing) ;
};

// Loan update
exports.update = function(req, res) {
  var loan = req.loan ;
  
  // Update individual fields
  // ???
  
  save(loan) ;
};

// Loan deletion
exports.delete = function(req, res) {
  var loan = req.loan ;
  
  // Find the loan of interest
  Loan.find(loan, function(err, loans) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } ;
		
    // Remove it from the database
		loans[0].remove(function(err) {
			if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(loans) ;
		}) ;
	}) ;
};

// Get all loans
exports.list = function(req, res) {
  Loan.find({}, function(err, loans) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } else res.json(loans) ;
	}) ;
};

// Get a loan by ID (do we need this?)
exports.loanByID = function(req, res, next, id) {
  Loan.findById(id).exec(function(err, loan) {
    if(err) { res.status(400).send(err) ; }
    else {
      req.loan = loan ;
      next() ;
    }
  });
};