
// Dependencies
var mongoose = require('mongoose');

// Define user schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,

  loans: Array,

  created_at: Date,
  updated_at: Date

  
});

// Any pre-processing on saving a loan document?
userSchema.pre('save', function(next) {
	
 if (!this.username) {
	var err = new Error('something went wrong');
 	next(err);
	}

 if (!this.password) {
 	var err = new Error('something went wrong');
 	next(err);
 //callback error
 	}


	var currentDate = new Date();

	// if created_at doesn't exist, add to that field
  	this.updated_at = currentDate;

  	if (!this.created_at)
    	this.created_at = currentDate;


	next() ;
});

// Create user model from schema
var User = mongoose.model('User', userSchema) ;

// Export user model to application
module.exports = User ;

//created on, created by, modified on, 
// TODO:     modified by (who created users)

