var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-type-email');

var Loan = require('./loans.model.js') ;

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
  name: {
    type: String,
    required: true
  },
  // NEED TO ADD THE FOLLOWING FIELDS:
  // -> name: { type: String, required: true }
  // Next to fix tests to account for the required fields
  // DL: drivers licence
  dl: {
    type: String,
    required: true
  },
  // DOB: dath of birth
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
  },

  isAdmin: {
    type: Boolean,
  },

  isSuperAdmin: {
    type: Boolean,
  },

  loans: Array,
  updated_at: Date,
  created_by: String,
  // Assign it to the token user?? idk yet
});

// TODO: Add trigger to auto link loans to new users on the fly

//--------------------------------------------------------------------------------------------------------------------
// Search loans database for loans whose purchaser information matches the specified User
// Affixes found loans to the this User
//--------------------------------------------------------------------------------------------------------------------
function affixUserToLoans(user) {

  // Construct a query from the specified user info
  var query = {
    "buyers_order.purchaser.dl": user.dl,
    "buyers_order.purchaser.dob": user.dob
  };

  // Find all loans according to the query
  Loan.find(query, function(err, loans) {
    if (err) { console.log(err); } else {

      // Update found loans with user ID
      loans.forEach(function(loan) {
        loan.user_id = user._id;
      });
    }
  });
}

//--------------------------------------------------------------------------------------------------------------------
// PRE-PROCESSING: Save
//--------------------------------------------------------------------------------------------------------------------
userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  
  if (!this.isAdmin)
    this.isAdmin = false;
  
  if (!this.isSuperAdmin)
    this.isSuperAdmin = false;
  
  // Before saving user, hash password
  var hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  this.password = hash;

  next();
});

//--------------------------------------------------------------------------------------------------------------------
// POST-PROCESSING: Save
//--------------------------------------------------------------------------------------------------------------------
userSchema.post('save', function(next) {
  
  // Attempt to affix this loan to an existing user
  affixUserToLoans(this) ;
  
  next() ;
});

userSchema.methods.comparePassword = function(password) {
  var is_same_password = bcrypt.compareSync(password, this.password)
  return is_same_password;
};

// need to add reset password server side ~
//      just another token thing?
// if you KNOW that you did not enter an email when creating this account, [contact us]mailto wrapper etc
userSchema.methods.reset = function(new_password) {
  this.password = bcrypt.hashSync(new_password, bcrypt.genSaltSync());
}

// Mongoose model of the above
var User = mongoose.model('Users', userSchema) ;
// User.collection.dropIndexes();

module.exports = User ;