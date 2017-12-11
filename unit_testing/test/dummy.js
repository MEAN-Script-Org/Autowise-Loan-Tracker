// MUAHAHAHAHA
// When connected to the right db, this script will create a backup super admin

'use strict';

// Dependencies - installed modules
var should   = require('should');
var mongoose = require('mongoose');
var request  = require('supertest');

// Heroku Variables
var config_loader = require('dotenv');
config_loader.load({path: ".env"});
config_loader.load({path: "../../.env"});

// Dependencies - local files
var express   = require('../../server/express.js');
var Loan      = require('../../server/db/loans.model.js');

describe('Backup user', function () {
  
  // Set timeout to 5 seconds
  this.timeout(5000);
  
  var agent;

  it('Doing the thing ~', function(done) {
    mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
    agent = request.agent(express.init());
    
    // Login arguments
    var newUser = {
      name:      'Fidel Castro',
      dob:       '1926/08/13',
      dl:        'F******3',
      username:  'super',
      password:  'admin',
      revolucion: 'SI',
    }
    
    // create new user
    agent.post('/new').send(newUser).expect(200)
    .end(function(err, res) {
      should.not.exist(res.body.err)
      done();
    });

  });

});