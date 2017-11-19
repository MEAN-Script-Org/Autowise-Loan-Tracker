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
    console.log("DELETION: ") ;
    console.log(req) ;
    console.log(req.loan) ;
    
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
  // Get all loans belonging to a particular user (based on ID)
  //--------------------------------------------------------------------------------------------------------------------
  loansByUserID: function(req, res, next) {
    // console.log(req.user, req.body, req.body.token);

    // Query loans with matching information and send them in a JSON response
    // TODO: figure out how the return looks like
    Loan.find({user_id : {$in: req.body.token.id}}, function(err, loans) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      }
      else { res.json(loans); }
    });
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Get a loan of the specified ID
  //--------------------------------------------------------------------------------------------------------------------
  loanByID: function(req, res, next, id) {
    if (id) {

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
    else {
      console.log("NO IDDDD");
      console.log(req.body, req.body.token);
    }
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Search loans database for loans whose purchaser information matches the specified User
  // Affixes found loans to the this User
  //--------------------------------------------------------------------------------------------------------------------
  affixLoans: function(user) {
    
    // Construct a query from the specified user info
    var query = {
      "buyers_order.purchaser.dl":  user.dl,
      "buyers_order.purchaser.dob": user.dob
    };
    
    // Find all loans according to the query
    Loan.find(query, function(err, loans) {
      if (err) { console.log(err); }
      else {
        
        // Update found loans with user ID
        loans.forEach(function(loan) {
          loan.user_id = user._id ;
          loan.save() ;
        });
      }
    });
  }
};