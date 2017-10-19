var mongoose = require('mongoose');

// Define user schema
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },

  loans: Array,
  created_at: Date,
  updated_at: Date
});

// Any pre-processing on saving a loan document?
userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// Mongoose model of the above
var User = mongoose.model('Users', userSchema) ;
module.exports = User ;

//created on, created by, modified on, 
// TODO:     modified by (who created users)