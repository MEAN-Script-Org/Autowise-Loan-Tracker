var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

// Define loan schema
/* 
Status : enum?/strings. 
  MUST BE VISIBLE on description/without clicking on them
  They can be
  RECEIVED/SUBMITTED
    RECEIVED => FROM OFFICE
    SUBMITTED => FROM BANK
  PENDING => everything in the process
  VERIFIED => REVIEWED APP, things are ok
  APPROVED/DENIED
  Archived : bool. True if (APPROVED/DENIED)
Costs
  Taxes
  Warranties ? => CHECK PICTURES. NEED MORE DETAILS
Types
  Auto Loan
  Repair
  Admin - need more details on this. Administrative fees?
Trades
  default to false/'[]' (empty array - which is 'falsey')
  ADMIN puts in trade information later
Comments
  Content : array with messages in reverse chronological order (easy to flip in angular)
    Need more clarification of what to put 'on top' as important message
  Date/timestamps - format tba later. not that important
  visibleToConsumer : bool
  important : bool
  CHANGE TO MOCKUP: Same area as normal info

*/

var loanSchema = new mongoose.Schema({
  user_id: String,
  status: String,
  types: String,
  name: String,
  
  costs: {
    taxes: Number,
    warranties: Number,
  },

  // trades: String/Array,
  trades: Boolean,
  comments: Array,
  updated_at: Date
});

// Any pre-processing on saving a loan document?
loanSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;

  if (!this.status)
    this.status = "RECEIVED";
  
  if (!this.types)
    this.types = "Auto Loan";

  next() ;
});

// Create loan model from schema
var Loan = mongoose.model('Loans', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
