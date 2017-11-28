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

function mm_dd_yyyy(string) {
  // mm/dd/YYYY
  return new Date(string).toLocaleDateString('en-IR');
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

  // Affixing possible already existing loans
  // console.log(this);


//--------------------------------------------------------------------------------------------------------------------
// POST-PROCESSING: Save
//--------------------------------------------------------------------------------------------------------------------
userSchema.post('save', function() {
  
  // Attempt to affix this loan to an existing user
  affixUserToLoans(this) ;
  
  // not using the DL for now... but could!
  var query = {
    "buyers_order.purchaser.name": this.name,
    "buyers_order.purchaser.dob": mm_dd_yyyy(this.dob),
  };

  var co_query = {
    "buyers_order.copurchaser.name": this.name,
    "buyers_order.copurchaser.dob": mm_dd_yyyy(this.dob),
  };

  // console.log(this);
  var user_id = this.id;
  console.log(user_id);

  // Find all loans according to the query, affix this user's id to them
  if (!Loan.find({ $or: [query, co_query]}, function(err, loans) {
    var temp_loans = [];
    console.log(loans.length);

    if (err) console.log(err);
    else {
      // Update found loans with user ID
      loans.forEach(function(loan) {
        loan.user_id = user_id;

        Loan.findByIdAndUpdate(loan._id, loan, {new: true},
          function(err, updated) {
          console.log("NEW!: ", updated);
        });
        
        temp_loans.push(loan._id);
      });
    }
  }))
    this.loans = temp_loans;
  
  next();

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