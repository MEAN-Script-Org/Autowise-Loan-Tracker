// This file details CRUD functionality of the loan database object
// Repurposed Assignment 3, might need to look better into it

var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var Loan = require('./loans.model.js') ;

module.exports = {

  create: function(req, res) {
    var newLoan = new Loan(req.body);

    newLoan.save(function(err, realNewLoan) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      } else res.json(realNewLoan) ;
    });
  },

  read: function(req, res) {
    res.json(req.loan) ;
  },

  // TODO: Make single view THAT FUCKING TAKES IN PARAMETERS!!
  // for /crud/:id => render request, then do a factory call for that ID, done!
  // I want to go to a specific loan...
  // Scrap this thing. needs to be on in the 'express' area
  // display: function(req, res) {
  //     res.redirect('/crud/' + req.loan._id);
  // },

  update: function(req, res) {
    var oldLoan = req.loan;
    // console.log(req.body);

    // Replace old loan's properties with the newly sent ones
    var loanToBeUpdated = Object.assign(oldLoan, req.body, function(former, replacement){
      if (!replacement) return former;
      else return replacement;
    });
    
    // {new: true} => Returns the real/actual updated version
    //             => 'updatedLoan'
    Loan.findByIdAndUpdate(oldLoan._id, loanToBeUpdated, {new: true}, 
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
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(loans) ;
    });
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Get all loans belonging to a particular user
  //--------------------------------------------------------------------------------------------------------------------
  loansByUserID: function(req, res) {
    // Sanity check
    // if (!req.user) {
    //   res.status(500).send() ;
    //   return ;
    // }
    
    Loan.find({ user_id: req.user._id }, function(err, loans) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(loans) ;
    });
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Get all loans belonging to a particular user described by their user info (name, DL, etc.)
  //--------------------------------------------------------------------------------------------------------------------
  loansByUserInfo: function(req, res) {
    // Assemble a query that will search the buyer's order field of loans
    var query = {
      buyers_order: {
        purchaser: {
          name:  req.body.userInfo.name,
          dl:    req.body.userInfo.dl,
          dob:   req.body.userInfo.dob,
          // email: req.body.userInfo.email,
        }
      }
    }
    
    // Query loans with matching information and send them in a JSON response
    Loan.find(query, function(err, loans) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      }
      else res.json(loans) ;
    });
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Get a loan of the specified ID
  //--------------------------------------------------------------------------------------------------------------------
  loanByID: function(req, res, next, id) {
    Loan.findById(id).exec(function(err, loan) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      }
      else {
        req.loan = loan;
        next() ;
      }
    });
  }
};