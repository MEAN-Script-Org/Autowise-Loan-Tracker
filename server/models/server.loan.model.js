
// Dependencies
var mongoose = require('mongoose') ;

// Define loan schema
var loanSchema = new mongoose.Schema({
	
});

// Any pre-processing on saving a loan document?
loanSchema.pre('save', function(next) {
	
	next() ;
});

// Create loan model from schema
var Loan = mongoose.model('Loan', loanSchema) ;

// Export loan model to application
module.exports = Loan ;
