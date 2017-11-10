var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

//----------------------------------------------------------------------------------------------------------------------
// LOAN SCHEMA
//======================================================================================================================
// Details a type and status and admin-created comments. Shows static info transcribed from the purchase order. Every
// loan is associated with a particular customer
//----------------------------------------------------------------------------------------------------------------------
var loanSchema = new mongoose.Schema({
  
  // Identifier information
  user_id:    String,
  user_email: String,
  name:       String,

  //trades:     Boolean,
  type:       String,   // Loan type
  status:     String,   // Loan status
  warranty:   Number,   // Warranty plan cost, if any
  comments:   Array,    // List of loan comments
  
  updated_at: Date,
  created_by: String,

  //--------------------------------------------------------------------------------------------------------------------
  // Purchase Order
  //====================================================================================================================
  // The original "paper copy" of a loan. Majority of fields described here are transcribed from the document
  //--------------------------------------------------------------------------------------------------------------------
  purchase_order: {
    form_date:       Date,
    is_car_used:     Boolean,
    email:           String,

    // Purchaser and Co-Purchaser
    purchaser: {
      name: {type:   String, /*required: false*/},
      dl:   {type:   String, /*required: false*/},
      dob:  {type:   Date,   /*required: false*/},
    },
    copurchaser: {
      invalid: {type: Boolean},
      name:    {type:   String, /*required: false*/},
      dl:      {type:   String, /*required: false*/},
      dob:     {type:   Date,   /*required: false*/},
    },

    // Contact information
    address: {
      street: {type: String, /*required: false*/},
      city:   {type: String, /*required: false*/},
      state:  {type: String, /*required: false*/},
      county: {type: String, /*required: false*/},
      zip:    {type: Number, /*required: false*/},
    },
    
    phone: {
      home: Number,
      work: Number,
      cell: Number,
    },

    // Car information
    car_info: {   
      year:             Number,
      make:             String,
      model:            String,
      type:             String,
      color:            String,
      cyl:              String,

      serial_no:        String,
      stock_no:         String,
      mileage:          Number,
      salesperson:      String,
      lender:           String,

      tag_no:           String,
      exp_date:         Date,
      transfer:         String,
      plate_no:         String,
      purchase_new_tag: String,
    },

    // Financing and fees
    finances: {
      nada_retail:         Number,
      accessories:         String,

      admin_fees:          Number,
      trade_allowance:     Number,
      trade_difference:    Number,
      total_sale_price:    Number,
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

      bal_owed_on_trade:   Number,
      down_payment:        Number,
      unpaid_due:          Number,
      total_due:           Number,
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
      type:        String,
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
    this.type = "Auto Loan";

  next();
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
