'use strict' ;

// Dependencies
var should = require('should') ;
var mongoose = require('mongoose') ;

var config_db = require('../../server/server.db_config.js') ;
var Loan = require('../../server/db/loans.model.js') ;

// TEST I: BACK-END DATABASE CRUD FUNCTIONALITY
describe('Loan backend unit test - Saving functionality:', function () {
  
  // Specify database connection
  before(function(done) {
    mongoose.connect(config_db.db.uri) ;
    
    done() ;
  }) ;
  
  describe('Creating, saving, modifying, and deleting Loan objects from the database', function () {
    
    // Set timeout to 5 seconds
    this.timeout(5000) ;
    
    // Database loan object
    var test_db_loan ;
    
    // Testing loan object that is well-defined
    var test_loan_ok = new Loan({
      status: '',
      types: 'Car Loan',
      costs: { taxes: 3000.00, warranties: 200.00 },
      trades: {},
      comments: ['This is a test']
    });
    
    // Testing loan object that is poorly defined
    var test_loan_bad = new Loan({});
    
    // Test #1.0: Loan is created and saved succesfully when missing status field
    it('Test #1.0: Loan is created and saved succesfully when missing \'status\' field', function(done) {
      test_loan_ok.save(function (err) {
        should.not.exist(err) ;
        
        done() ;
      });
    });
    
    // Test #1.1: Loan is created AND uploaded successfully (can be fetched from the database)
    it('Test #1.1: Loan is created AND uploaded successfully (can be fetched from the database)', function(done) {
      Loan.find({comments: test_loan_ok.comments}, function(err, loans) {
        should.not.exist(err) ;
        test_db_loan = loans[0] ;
        
        done() ;
      });
    });
    
    // Test #1.2: Loan 'status' field updated to 'RECEIVED' due to unspecified 'status'
    it('Test #1.2: Loan \'status\' field updated to \'RECEIVED\' due to unspecified \'status\'', function(done) {
      test_db_loan.status.should.equal('RECEIVED') ;
      
      done() ;
    });
    
    // Test #1.3: Other Loan fields match those of uploaded Loan
    it('Test #1.3: Other Loan fields match those of uploaded Loan', function(done) {
      test_db_loan.types.should.equal(test_loan_ok.types) ;
      test_db_loan.costs.taxes.should.equal(test_loan_ok.costs.taxes) ;
      test_db_loan.costs.warranties.should.equal(test_loan_ok.costs.warranties) ;
      test_db_loan.trades.should.equal(test_loan_ok.trades) ;
      test_db_loan.comments[0].should.equal(test_loan_ok.comments[0]) ;
      should.not.exist(test_db_loan.comments[1])
      
      done() ;
    });
    
    // Test #1.4: Error is thrown when attempting to save without 'types' field
    it('Test #1.4: Error is thrown when attempting to save without \'types\' field', function(done) {
      test_loan_bad.save(function (err) {
        should.exist(err) ;
        
        done() ;
      });
    });
    
    // Test #1.5: Loan can be deleted from the database
    it('Test #1.5: Loan can be deleted from the database', function(done) {
      test_db_loan.remove(test_db_loan, function (err) {
        should.not.exist(err) ;
        
        done() ;
      });
    });
    
    // Test #1.6: Loan is successfully removed from the database
    it('Test #1.6: Loan is successfully removed from the database', function(done) {
      Loan.find({_id: test_db_loan._id}, function(err, loans) {
        should.not.exist(err) ;
        should.not.exist(loans[0]) ;
        
        done() ;
      });
    });
  });
});