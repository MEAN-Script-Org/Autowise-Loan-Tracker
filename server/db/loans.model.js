var mongoose = require('mongoose') ;

var loans = require('./loans.crud.js') ;

mongoose.Promise = global.Promise;

//----------------------------------------------------------------------------------------------------------------------
// LOAN SCHEMA
//======================================================================================================================
// Details a type and status and admin-created comments. Shows static info transcribed from the purchase order. Every
// loan is associated with a particular customer
//----------------------------------------------------------------------------------------------------------------------
var loanSchema = new mongoose.Schema({
  
  //--------------------------------------------------------------------------------------------------------------------
  // User ID information
  //--------------------------------------------------------------------------------------------------------------------
  user_id:    String,
  user_dob:   String,
  user_email: String,
  user_name:  String,
  
  //--------------------------------------------------------------------------------------------------------------------
  // App Functionality
  //--------------------------------------------------------------------------------------------------------------------
  type:       String,   // Loan type
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
  updated_at: Date,
  created_by: String,

  //--------------------------------------------------------------------------------------------------------------------
  // Buyers Order
  //====================================================================================================================
  // The original "paper copy" of a loan. Majority of fields described here are transcribed from the document
  //--------------------------------------------------------------------------------------------------------------------
  buyers_order: {
    form_date:       Date,
    is_car_used:     Boolean,
    
    // Purchaser and Co-Purchaser
    purchaser: {
      name:  {type:   String, required: true},
      email: {type:   String, required: false},
      dl:    {type:   String, required: true},
      dob:   {type:   Date,   required: true},

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
      dob:     {type:   Date,   /*required: false*/},

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
      // 'type' is a reserved word, lol
      // i think it's cuz we already have it.. lol
      type_t:           {type: String, required: true}, 
      color:            {type: String, required: true},
      cyl:              Number,

      serial_no:        String,
      stock_no:         String,
      mileage:          Number,
      salesperson:      String,
      lender:           String,

      tag_no:           String,
      exp_date:         Date,
      transfer:         String,
      plate_no:         String,
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
      // TODO: automatic calculation ?
      sub_total_a:         Number,
      
      sales_tax: {
        is_county:         Boolean,
        percentage:        Number,
      },

      estimated_fees:      Number,
      lemon_law_fee:       Number,
      // TODO: automatic calculation
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
      good_thru:   Date,
    },
  }

});

// On save preprocessing
loanSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;

  // Fill in fields if missing
  if (!this.status)
    this.status = "RECEIVED";
  else
    this.status = this.status.toUpperCase();
  
  // TODO: Enforce all uppercase in server too
  if (!this.type)
    this.type = "AUTO";

  next();
});

loanSchema.post('save', function() {
  // Affix any dangling loans in the database to this User
  // loans.affixLoansToUser(this) ;
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
