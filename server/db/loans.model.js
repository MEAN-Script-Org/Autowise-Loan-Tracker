var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
require('mongoose-type-email');

var User = require('./users.model.js') ;

//----------------------------------------------------------------------------------------------------------------------
// LOAN SCHEMA
//======================================================================================================================
// Details a type and status and admin-created comments. Shows static info transcribed from the purchase order. Every
// loan is associated with a particular customer
//----------------------------------------------------------------------------------------------------------------------
var loanSchema = new mongoose.Schema({
  
  // REMINDER: SAVE ALL DATES AS STRINGS!!!
  // except for the comments (not on this file, so don't worry about it)

  //--------------------------------------------------------------------------------------------------------------------
  // User information
  //--------------------------------------------------------------------------------------------------------------------
  // this needs to be a Array
  user_ids:  [String],
  
  //--------------------------------------------------------------------------------------------------------------------
  // App Functionality
  //--------------------------------------------------------------------------------------------------------------------
  // type:         String,   // Loan type
  status:     String,   // Loan status
  comments:   Array,    // List of loan comments
  
  //--------------------------------------------------------------------------------------------------------------------
  // Warranty plan information
  //--------------------------------------------------------------------------------------------------------------------
  warranty: {
    type_t: String,
    price:  Number,
    term :  {months: Number,   miles: Number},
  },
  
  //--------------------------------------------------------------------------------------------------------------------
  // Tracking information
  //--------------------------------------------------------------------------------------------------------------------
  created_at: String,
  updated_at: String,
  created_by: String,

  //--------------------------------------------------------------------------------------------------------------------
  // Buyers Order
  //====================================================================================================================
  // The original "paper copy" of a loan. Majority of fields described here are transcribed from the document
  //--------------------------------------------------------------------------------------------------------------------
  buyers_order: {
    // Purchaser and Co-Purchaser
    purchaser: {
      name:     {type:   String, required: true},
      email:    {type:   mongoose.SchemaTypes.Email, required: false},
      dl:       {type:   String, required: true},
      dob:      {type:   String,   required: true},

      // Contact information
      address: {
        street: {type: String, required: true},
        city:   {type: String, required: true},
        state:  {type: String, required: true},
        county: {type: String, required: true},
        zip:    {type: Number, required: true},
      },
    
      phone: {
        home: {type: Number},
        work: {type: Number},
        cell: {type: Number, required: true},
      },
    },
    
    copurchaser: {
      invalid: {type: Boolean},
      name:    {type:   String, /*required: false*/},
      dl:      {type:   String, /*required: false*/},
      dob:     {type:   String,   /*required: false*/},

      // Contact information
      address: {
        street: {type: String, /*required: false*/},
        city:   {type: String, /*required: false*/},
        state:  {type: String, /*required: false*/},
        county: {type: String, /*required: false*/},
        zip:    {type: Number, /*required: false*/},
      },
    },

    // Car information
    car_info: {   
      year:             {type: Number, required: true},
      make:             {type: String, required: true},
      model:            {type: String, required: true},
      
      // 'type' is a reserved word
      // i think it's cuz we already have it..
      type_t:           {type: String, required: true}, 
      color:            {type: String, required: true},
      cyl:              Number,

      serial_no:        String,
      stock_no:         String,
      mileage:          Number,
      salesperson:      String,
      lender:           String,

      tag_no:           String,
      exp_date:         String,
      transfer:         String,
      plate_no:         String,
      // NEW/USED as a STRING
      license_plate:    String,
      // license_plate:    {type: String, required: true},
    },

    // Financing and fees
    finances: {
      nada_retail:         {type: String, required: true},
      admin_fees:          {type: Number, required: true},
      trade_allowance:     {type: Number, required: true},
      trade_difference:    {type: Number, required: true},
      total_sale_price:    {type: Number, required: true},
      sub_total_a:         Number,
      
      sales_tax: {
        is_county:         Boolean,
        percentage:        Number,
      },

      estimated_fees:      Number,
      lemon_law_fee:       Number,
      sub_total_b:         Number,

      bal_owed_on_trade:   {type: Number, required: true},
      total_due:           {type: Number, required: true},
      down_payment:        Number,
      unpaid_due:          Number,
    },

    // Insurance information
    insr: {
      agent:       String,
      company:     String,
      verif_by:    String,
      phone_no:    Number,
      policy_no:   Number,
      eff_dates:   String,
    },

    // Trades information
    trade_in: {
      year:        Number,
      make:        String,
      model:       String,
      type_t:      String,
      color:       String,
      cyl:         String,

      holder:      String,
      mileage:     Number,
      address:     String,
      phone_no:    Number,
      serial_no:   String,
      account_no:  String,
      amount:      Number,
      verif_by:    String,
      qualif_by:   String,
      good_thru:   String,
    },
  }

});

// function yyyy_mm_dd(string) {
//   // CORRECT FORMAT FOR 'date' type input transcition
//   // YYYY-mm-dd
//   return new Date(string).toLocaleDateString('km-KH');
// }

function mm_dd_yyyy(string) {
  // mm/dd/YYYY
  return new Date(string).toLocaleDateString('en-IR');
}


function formatDates(bo) {

  bo.purchaser.dob = mm_dd_yyyy(bo.purchaser.dob);

  if (bo.copurchaser.dob)
    bo.copurchaser.dob = mm_dd_yyyy(bo.copurchaser.dob);
  
  if (bo.car_info.exp_date)
    bo.car_info.exp_date = mm_dd_yyyy(bo.car_info.exp_date);

  if (bo.car_info.good_thru)
    bo.car_info.good_thru = mm_dd_yyyy(bo.car_info.good_thru);

  if (bo.insr.eff_dates)
    bo.insr.eff_dates = mm_dd_yyyy(bo.insr.eff_dates);

  return bo;
}


//--------------------------------------------------------------------------------------------------------------------
// PRE-PROCESSING: Save
//--------------------------------------------------------------------------------------------------------------------
loanSchema.pre('save', function(next) {
  // console.log("HEY!") ;
  
  // Forcing this
  this.status = "RECEIVED";
  
  var currentDate = new Date();
  // these could be used for filtering ~ but idk too fancy no time
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  // CORRECLTY Format all dates
  this.buyers_order = formatDates(this.buyers_order);


  // Find all loans according to the query, affix this user's id to them
  var loan_id = this.id;
  // console.log(loan_id);

  if (!User.find({ loans: loan_id }, function(err, users) {
    var temp_users = [];
    console.log(users.length);

    if (err) console.log(err);
    else {
      // Update found users with loan ID
      users.forEach(function(user) {
        user.loans.push(loan_id);

        User.findByIdAndUpdate(user._id, user, {new: true},
          function(err, updated) {
          console.log("NEW!: ", updated);
        });
      });
    }
  }))
    this.user_ids = temp_users;

  next();
});

//--------------------------------------------------------------------------------------------------------------------
// RE-PROCESSING: update
//--------------------------------------------------------------------------------------------------------------------
loanSchema.pre('update', function() {
  this.status = this.status.toUpperCase();

  // CORRECLTY Format all dates
  // ALL THE TIME!
  this.updated_at = new Date();
  this.buyers_order = formatDates(this.buyers_order);
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;
// this.collection.dropIndexes();

// Export loan model to application
module.exports = Loan ;
