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
  },

  loans: Array,
  created_by: String,
  updated_at: Date,
});

// Any pre-processing on saving a loan document?
userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  
  if (!this.isAdmin)
    this.isAdmin = false;

  next();
});

// Mongoose model of the above
var User = mongoose.model('Users', userSchema) ;
module.exports = User ;