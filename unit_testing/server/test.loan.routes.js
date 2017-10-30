'use strict' ;

// Dependencies - installed modules
var should   = require('should') ;
var mongoose = require('mongoose') ;
var request  = require('supertest') ;
var config_loader = require('dotenv');

config_loader.load({path: ".env"});
config_loader.load({path: "../../.env"});

// Dependencies - local files
var Loan      = require('../../server/db/loans.model.js') ;
var express   = require('../../server/express.js') ;

//======================================================================================================================
// TEST GROUP II - FRONT-END LOAN HTTP ROUTING
//======================================================================================================================
describe('TEST GROUP II - FRONT-END LOAN HTTP ROUTING', function () {
  
  // Specify HTTP agent
  var agent ;
  before(function(done) {
    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    agent = request.agent(express.init()) ;
    
    done() ;
  });
  
  // Set timeout to 5 seconds
  this.timeout(5000) ;
  
  // Database loan objects
  var test_loan_id ;
  
  // Testing loan object that is well-defined
  var test_loan_ok = new Loan({
    status: '',
    type: 'Car Loan',
    // costs: { taxes: 3000.00, warranty: 200.00 },
    warranty: 200.00,
    trades: {},
    comments: ['This is a test']
  });
  
  // Testing loan object that is poorly defined
  var test_loan_bad = new Loan({});
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.0: Loan is created and saved succesfully -> HTTP response body is JSON of posted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.0: Loan is created and saved succesfully -> HTTP response body is JSON of posted Loan', function(done) {
    agent.post('/api/loans/').send(test_loan_ok).expect(200).end(function(err, res) {
      should.not.exist(err) ;
      should.exist(res) ;
      should.exist(res.body._id) ;
      
      test_loan_id = res.body._id ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.1: Loan is created AND uploaded successfully -> HTTP response body is JSON of posted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.1: Loan is created AND uploaded successfully -> HTTP response body is JSON of posted Loan', function(done) {
    agent.get('/api/loan/' + test_loan_id).expect(200).end(function(err, res) {
      should.exist(res) ;
      
      res.body.status.should.equal('Received') ;
      res.body.type.should.equal(test_loan_ok.type) ;
      // TBChanged
      // res.body.taxes.should.equal(test_loan_ok.taxes) ;
      res.body.warranty.should.equal(test_loan_ok.warranty) ;
      res.body.trades.should.equal(test_loan_ok.trades) ;
      res.body.comments[0].should.equal(test_loan_ok.comments[0]) ;
      should.not.exist(res.body.comments[1]) ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.2: All Loans may be retrieved -> HTTP response body is JSON array of Loans
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.2: All Loans may be retrieved -> HTTP response body is JSON array of Loans', function(done) {
    agent.get('/api/loans').expect(200).end(function(err, res) {
      should.not.exist(err) ;
      should.exist(res.body) ;
      
      // maybe have your own DB test this
      // res.body.should.have.length(1) ; 
      // Should be a single Loan in the database
      //    Not exactly
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.3: May update a loan successfully -> HTTP response body is JSON of posted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.3: May update a loan successfully -> HTTP response body is JSON of posted Loan', function(done) {
    // Assignment needs to be wrapped in an if due to its async nature
    if (test_loan_ok.status = 'PENDING') {
      agent.put('/api/loan/' + test_loan_id).send(test_loan_ok).expect(200).end(function(err, res) {
        should.not.exist(err) ;
        res.body.status.should.equal(test_loan_ok.status)
        done() ;
      });
    }
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.5: May delete a Loan -> HTTP response body is JSON deleted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.5: May delete a Loan -> HTTP response body is JSON deleted Loan', function(done) {
    agent.delete('/api/loan/' + test_loan_id).expect(200).end(function(err, res) {
      should.not.exist(err) ;
      should.exist(res) ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.6: Loan is successfully removed from database
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.6: Loan is successfully removed from database', function(done) {
    agent.get('/api/loan/' + test_loan_id).expect(400).end(function(err, res) {
      done() ;
    });
  });
});