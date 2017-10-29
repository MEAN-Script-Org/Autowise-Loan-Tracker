var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

//----------------------------------------------------------------------------------------------------------------------
// LOAN SCHEMA
//======================================================================================================================
// Details a type and status and admin-created comments. Shows static info transcribed from the purchase order. Every
// loan is associated with a particular customer
//----------------------------------------------------------------------------------------------------------------------
var loanSchema = new mongoose.Schema({

  // DISTANCE TO FIELDS SHOULD NOT WILDLY VARY!!
  //    MY.EYES . THEY.HURT

  // Foreign Key
  user_id:    String,
  name:       String,
  updated_at: Date,

  // This field is redundant, already as 'status'
  // archived: {type: Boolean, default: false},

  // Loan type and status
  type:       String,
  status:     String,
  // Warranty plan cost, if any
  warranty:   Number,
  trades:     Boolean,
  comments:   Array,
  created_by: String,

  //--------------------------------------------------------------------------------------------------------------------
  // Purchase Order
  //====================================================================================================================
  // The original "paper copy" of a loan. Majority of fields described here are transcribed from the document
  //--------------------------------------------------------------------------------------------------------------------
  // TODO: Clean the hell out of this to see what's really needed. 
  //       otherwise DB is gonna be $$$
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
      name: {type:   String, /*required: false*/},
      dl:   {type:   String, /*required: false*/},
      dob:  {type:   Date,   /*required: false*/},
    },

    // Contact information
    address: {
      street: {type: String, /*required: false*/},
      city:   {type: String, /*required: false*/},
      state:  {type: String, /*required: false*/},
      county: {type: String, /*required: false*/},
      zip:    {type: Number, /*required: false*/},
    },

    // TODO: any of these required?
    // Only one of these are REALLY needed
    phone: {
      home: Number,
      work: Number,
      cell: Number,
    },

    // Car information
    // TODO: what here is required?
    car_info: {   
      year:             Number,
      make:             String,
      model:            String,
      type:             String,
      color:            String,
      // TODO: what is this?
      cyl:              String,

      serial_no:        String,
      stock_no:         String,
      mileage:          Number,
      salesperson:      String,
      // TODO: can implement as an array -> most recent lender at end of array
      //   Followup -> This will be a waste of time, leave it for the comments
      //           If anything changing the lender will trigger a comment, etc
      lender:           String,

      tag_no:           String,
      exp_date:         Date,
      transfer:         String,
      plate_no:         String,
      purchase_new_tag: String,
    },

    // Financing and fees
    // TODO: what here is required?
    finances: {
      nada_retail:         Number,
      accessories:         String,

      admin_fees:          Number,
      trade_allowance:     Number,
      trade_difference:    Number,
      total_sale_price:    Number,
      waste_tire_batt_fee: Number,
      // TODO: automatic calculation ?
      sub_total_a:         Number,

      // TODO: is this necessary?
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
    // TODO: what here is required?
    insurance_info: {
      agent:       String,
      company:     String,
      verif_by:    String,
      phone_no:    Number,
      policy_no:   Number,
      eff_dates:   String,
    },

    // Trades information
    // TODO: what here is required?
    trade_in: {
      year:        Number,
      make:        String,
      model:       String,
      type:        String,
      color:       String,
      // TODO: what is this?!
      cyl:         String,

      holder:      String,
      mileage:     Number,
      address:     String,
      phone_no:    Number,
      serial_no:   String,
      account_no:  String,

      // TODO: what is this?!
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

  if (!this.type)
    this.type = "Auto Loan";

  next();
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
