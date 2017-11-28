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
  
  // Set timeout to 5 seconds
  this.timeout(5000) ;
  
  // Database loan objects
  var test_loan_id ;
  
  // Testing loan objects that are well-defined
  var test_loan_ok = new Loan({
    buyers_order: {
      purchaser: {
        name:  'Oswald the Lucky Rabbit',
        dl:    'ABC',
        dob:   new Date('1923/11/23'),
        address: {
          street: '108 Somewhere Lane',
          city:   'Disney World',
          state:  'FL',
          county: 'Orange',
          zip:    '12345',
        },
        phone: {
          cell: '1234567890',
        },
      },
      car_info: {   
        year:   1999,
        make:   'Ford',
        model:  'T',
        type_t: 'Old', 
        color:  'Black & White'
      },
      finances: {
        nada_retail:       1000,
        admin_fees:        1000,
        trade_allowance:   1000,
        trade_difference:  1000,
        total_sale_price:  1000,
        bal_owed_on_trade: 1000,
        total_due:         1000
      }
    }
  });
  
  // Testing loan object that is poorly defined
  var test_loan_bad = new Loan({});
  
  // Specify tokens
  var token_ok ;
  var token_haxxor = 'jo_mamma'
  
  before(function(done) {
    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    agent = request.agent(express.init()) ;
    
    // Login arguments
    var args = {
      username: 'super',
      password: 'admin',
      md5hash: 'gardner-mccune > dave small'
    }
    
    // Gimme' a token
    agent.post('/login').send(args).expect(200).end(function(err, res) {
      token_ok = res.body ;
      test_loan_ok.token = token_ok ;
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.0: Loan is created and saved succesfully -> HTTP response body is JSON of posted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.0: Loan is created and saved succesfully -> HTTP response body is JSON of posted Loan', function(done) {
    agent.post('/api/loans/').send({token: token_ok, data: test_loan_ok}).expect(200).end(function(err, res) {
      console.log("TOKEN:") ;
      console.log(token_ok) ;
      
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
      
      var db_purchaser = res.body.buyers_order.purchaser ;
      var purchaser = test_loan_ok.buyers_order.purchaser ;
      
      res.body.status.should.equal('RECEIVED') ;
      
      // Check a few select fields
      db_purchaser.name.should.equal(purchaser.name) ;
      db_purchaser.dl.should.equal(purchaser.dl) ;
      db_purchaser.dob.should.equal(purchaser.dob) ;
      
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
      
      done() ;
    });
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.3: May update a loan successfully -> HTTP response body is JSON of posted Loan
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #2.3: May update a loan successfully -> HTTP response body is JSON of posted Loan', function(done) {
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