// MUAHAHAHAHA
// When connected to the right db, this script will create a backup super admin

'use strict' ;

// Dependencies - installed modules
var should   = require('should') ;
var mongoose = require('mongoose') ;
var request  = require('supertest') ;

// Heroku Variables
var config_loader = require('dotenv');
config_loader.load({path: ".env"});
config_loader.load({path: "../../.env"});

// Dependencies - local files
var Loan      = require('../../server/db/loans.model.js') ;
var express   = require('../../server/express.js') ;

describe('Making backup super admin', function () {
  
  // Set timeout to 5 seconds
  this.timeout(5000) ;
  
  var agent;
  
  before(function(done) {
    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    
    // this hash don't matter...
    var dummy_hash = 'gardner-mccune > dave small' ;

    agent = request.agent(express.init()) ;
    // Login arguments
    var args = {
      username: 'super',
      password: 'admin',
      md5hash: dummy_hash,
    }
    
    // Gimme' a token
    // Append hash to it as well as dictated by the authentication module
    agent.post('/login').send(args).expect(200).end(function(err, res) {
      token_hash_ok = res.body + ',' + test_hash ;
      
      done() ;
    });

  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #2.0: Loan is created and saved succesfully -> HTTP response is empty object
  //--------------------------------------------------------------------------------------------------------------------
  it('', 
    function(done) {

  });


  after('bleh',
    function (done) {
      
  });

});