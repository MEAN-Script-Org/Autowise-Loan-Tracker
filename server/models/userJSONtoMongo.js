'use strict';
/* 
  Import modules/files you may need to correctly run the script. 
  Make sure to save your DB's uri in the config file, then import it with a require statement!
 */
var fs = require('fs'),
    mongoose = require('mongoose'), 
    Schema = mongoose.Schema, 
    User = require('./user.loan.model.js'),
    config = require('./server.db_config.js');
    var newListing = new User

/* Connect to your database */
mongoose.connect('mongodb://michaeltngo:pw@ds121225.mlab.com:21225/car-loan-users');


/* 
  Instantiate a mongoose model for each listing object in the JSON file, 
  and then save it to your Mongo database 
 */

fs.readFile('UserListings.json', 'utf8', function(err, data) {
  
  if (err) {
    console.log(err);
    return;
  }
  


  else {
    
    data = JSON.parse(data);
    data = data["entries"];
    var arrayLength = data.length;



    for (var i = 0; i < arrayLength; i++) {
        



      var newListing = new User({
        code: data[i].code, 
        name: data[i].name
        
      });

      if (data[i].username) {
          newListing.username = data[i].username;
        }

      if (data[i].password) {
          newListing.password = data[i].password;
        }

      if (data[i].isAdmin) {
          newListing.isAdmin = data[i].isAdmin;
        }

      if (data[i].created_at) {
          newListing.created_at = data[i].created_at;
        }

      if (data[i].updated_at) {
          newListing.updated_at = data[i].updated_at;
        }

    newListing.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully!');
    });


    }



  }

});



/* 
  Once you've written + run the script, check out your MongoLab database to ensure that 
  it saved everything correctly. 
 */