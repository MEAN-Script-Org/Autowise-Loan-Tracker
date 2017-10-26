'use strict' ;

// Dependencies - installed modules
var should   = require('should') ;
var mongoose = require('mongoose') ;
var config_loader = require('dotenv');

config_loader.load({path: "../../.env"});

// Dependencies - local files
var Loan      = require('../../server/db/loans.model.js') ;
var express   = require('../../server/express.js') ;

//======================================================================================================================
// TEST GROUP I - BACK-END DATABASE CRUD FUNCTIONALITY
//======================================================================================================================
describe('TEST GROUP I - BACK-END DATABASE CRUD FUNCTIONALITY', function () {
  
  // Specify database connection
  before(function(done) {

    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    //'mongodb://max_admin2:n$E0yDCyLc07@ds119044.mlab.com:19044/cen-class'
    done() ;
  }) ;
  
  // Set timeout to 5 seconds
  this.timeout(5000) ;
  
  // Database loan object
  var test_db_loan ;
  
  // Testing loan objects that are well-defined
  var test_loan_ok = new Loan({
    purchase_order: {
      purchaser: {
        name: "Marcial Abrrrrahantes",
        dl:   "E123456789",
        dob:  "5/15/1996",
      },
      
      // Contact information
      address: {
        street: "Hello World Rd.",
        city:   "El Paso",
        state:  "Texas",
        county: "Somewhere in Texas",
        zip:    142536,
      },
    },
    
    comments: ['This is a test'],
  });
  
  // Testing loan object that is poorly defined
  var test_loan_bad = new Loan({});
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.0: Loan is created and saved succesfully when missing 'status' field
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.0: Loan is created and saved succesfully when missing \'status\' field', function(done) {
    test_loan_ok.save(function (err) {
      should.not.exist(err) ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.1: Loan is created AND uploaded successfully (can be fetched from the database)
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.1: Loan is created AND uploaded successfully (can be fetched from the database)', function(done) {
    Loan.find({comments: test_loan_ok.comments}, function(err, loans) {
      should.not.exist(err) ;
      test_db_loan = loans[0] ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.2: Loan is created and saved succesfully when missing 'type' field
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.2: Loan is created and saved succesfully when missing \'type\' field', function(done) {
    test_db_loan.type = '' ;
    
    test_db_loan.save(function (err) {
      should.not.exist(err) ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.3.0: Loan 'status' field updated to 'RECEIVED' due to unspecified 'status'
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.3.0: Loan \'status\' field updated to \'RECEIVED\' due to unspecified \'status\'', function(done) {
    test_db_loan.status.should.equal('RECEIVED') ;
    
    done() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.3.1: Loan 'type' field updated to 'Auto Loan' due to unspecified 'type'
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.3.1: Loan \'type\' field updated to \'Auto Loan\' due to unspecified \'type\'', function(done) {
    test_db_loan.type.should.equal('Auto Loan') ;
    
    done() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.4: Loan Comments field match that of uploaded Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.4: Loan Comments field match that of uploaded Loan', function(done) {
    test_db_loan.comments[0].should.equal(test_loan_ok.comments[0]) ;
    should.not.exist(test_db_loan.comments[1])
    
    done() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.5: Loan can be deleted from the database
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.5: Loan can be deleted from the database', function(done) {
    test_db_loan.remove(test_db_loan, function (err) {
      should.not.exist(err) ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.6: Loan is successfully removed from the database
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.6: Loan is successfully removed from the database', function(done) {
    Loan.find({_id: test_db_loan._id}, function(err, loans) {
      should.not.exist(err) ;
      should.not.exist(loans[0]) ;
      
      done() ;
    });
  });
});
