var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

/* Loan schema notes/unresolved issues and fields ~
  - visibleToConsumer : bool
  - important : bool
*/

//----------------------------------------------------------------------------------------------------------------------
// LOAN SCHEMA
//======================================================================================================================
// Details a type and status and admin-created comments. Shows static info transcribed from the purchase order. Every
// loan is associated with a particular customer
//----------------------------------------------------------------------------------------------------------------------
var loanSchema = new mongoose.Schema({
  
  // Foreign Key
  user_id:    String,
  name:       String,
  updated_at: Date,
  
  archived: {type: Boolean, default: false},
  
  // Loan type and status
  type:   String,
  status: String,
  
  // Warranty plan cost, if any
  warranty: Number,
  
  trades:     Boolean,
  comments:   Array,
  
  //--------------------------------------------------------------------------------------------------------------------
  // Purchase Order
  //====================================================================================================================
  // The original "paper copy" of a loan. Majority of fields described here are transcribed from the document
  //--------------------------------------------------------------------------------------------------------------------
  purchase_order: {
    form_date:   Date,
    is_car_used: Boolean,
    email:       String,
  
    // Purchaser and Co-Purchaser
    purchaser: {
      name: {type: String, required: false},
      dl:   {type: String, required: false},
      dob:  {type: Date,   required: false},
    },
    copurchaser: {
      name: {type: String, required: false},
      dl:   {type: String, required: false},
      dob:  {type: Date,   required: false},
    },
    
    // Contact information
    address: {
      street: {type: String, required: false},
      city:   {type: String, required: false},
      state:  {type: String, required: false},
      county: {type: String, required: false},
      zip:    {type: Number, required: false},
    },
    
    phone: {  // TODO: any of these required?
      home: Number,
      work: Number,
      cell: Number,
    },
    
    // Car information
    car_info: {   // TODO: what here is required?
      year:        Number,
      make:        String,
      model:       String,
      type:        String,
      color:       String,
      cyl:         String,     // TODO: what is this
      
      serial_no:   String,
      stock_no:    String,
      mileage:     Number,
      salesperson: String,
      lender:      String,     // TODO: can implement as an array -> most recent lender at end of array
      
      purchase_new_tag: String,
      transfer:         String,
      tag_no:           String,
      plate_no:         String,
      exp_date:         Date,
    },
    
    // Financing and fees
    finances: {   // TODO: what here is required?
      nada_retail: Number,
      accessories: String,
      
      total_sale_price:    Number,
      trade_allowance:     Number,
      trade_difference:    Number,
      admin_fees:          Number,
      waste_tire_batt_fee: Number,
      sub_total_a:         Number,    // TODO: automatic calculation
      
      sales_tax: {
        is_county:  Boolean,   // TODO: is this necessary?
        percentage: Number,
      },
      
      estimated_fees: Number,
      lemon_law_fee:  Number,
      sub_total_b:    Number,          // TODO: automatic calculation
      
      bal_owed_on_trade: Number,
      total_due:         Number,
      down_payment:      Number,
      unpaid_due:        Number,
    },
    
    // Insurance information
    insurance_info: { // TODO: what here is required?
      policy_no: Number,
      company:   String,
      agent:     String,
      phone_no:  Number,
      eff_dates: String,
      verif_by:  String,
    },
    
    // Trades information
    trade_in: { // TODO: what here is required?
      year:        Number,
      make:        String,
      model:       String,
      type:        String,
      color:       String,
      cyl:         String,     // TODO: what is this?!
      
      serial_no:   String,
      account_no:  String,
      mileage:     Number,
      phone_no:    Number,
      holder:      String,
      address:     String,
      
      amount:      Number,    // TODO: what is this?!
      qualif_by:   String,
      verif_by:    String,
      good_thru:   Date,
    },
  }
  
});

// On save preprocessing
loanSchema.pre('save', function(next) {
  
  // Mark update time
  var currentDate = new Date();
  this.updated_at = currentDate;

  // Fill in status field if missing
  if (!this.status)
    this.status = "RECEIVED";
  
  // Fill in type field if missing
  if (!this.type)
    this.type = "Auto Loan";

  next();
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
