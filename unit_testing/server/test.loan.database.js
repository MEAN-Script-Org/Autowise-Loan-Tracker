'use strict' ;

// Dependencies
var should = require('should') ;
var mongoose = require('mongoose') ;

var config_db = requre('../../server/server.db_config.js') ;
var Loan = mongoose.model('Loan') ;

// Global variables
var loan ;

// TEST: SAVING FUNCTIONALITY
describe('Loan backend unit test - Saving functionality:', function () {
  
  before(function(done) {
    mongoose.connect(db_config.db.uri) ;
    done() ;
  }) ;
  
  describe('Create and save a Loan', function () {
    
    // Set timeout to 5 seconds
    this.timeout(5000) ;
    
    // Testing loan object
    test_loan = new Loan({
      status: '',
      types: 'Car Loan',
      costs: { taxes: 3000.00, warranties: 200.00 },
      trades: {},
      comments: ['This is a test']
    });
    
    // Test that status is set to 'RECEIVED' when missing status field
    it('\status\' set to \'RECEIVED\' when \'status\' is unspecified', function (done) {
      return test_loan.save(function (err) {
        
        // Test #1.0: Loan was created successfully
        should.not.exist(err) ;
        
        // Test #1.1: Loan was created AND uploaded successfully
        Loan.find({comments: test_loan.comments }, function(err, loans) {
          should.not.exist(err) ;
          
          // Test #1.2: Status is set to 'RECEIVED' when missing status field
          loans[0].status.should.equal('RECEIVED') ;
          
          // Tests #1.3-1.6: Other fields match those of 'test_loan'
          loans[0].types.should.equal(test_loan.types) ;
          loans[0].costs.should.equal(test_loan.costs) ;
          loans[0].trades.should.equal(test_loan.trades) ;
          loans[0].comments.should.equal(test_loan.comments) ;
        }) ;
        
        done() ;
      });
    });
    
    // Test error thrown on missing types field
    test_loan.types = '' ;
    it('Error thrown when \'types\' is unspecified', function (done) {
      return test_loan.save(function (err) {
        
        // Test #2.0: Loan could not be created
        should.exist(err) ;
        done() ;
      });
    });
    
    loan.types = 'Car Loan' ;
  });
});