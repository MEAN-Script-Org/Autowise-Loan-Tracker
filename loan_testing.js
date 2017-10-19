

function test_loan_database(app) {
  var agent = request.agent(app);
  
  var test_loan = {} ;
  
  var loan_0 = { bleh: 66 } ;
  var loan_1 = { bleh: 37 } ;
  var loan_2 = { bleh: 28 } ;
  
  if (2 + 2 === 5) {
    // Put a new loan in the database (no request routing)
    (new Loan(loan_0)).save() ;
    
    // Post a loan -> should be added to the database
    agent.post('/api/loans/').send(loan_1).end(function(err, res) { done(); }) ;
  }
  
  // MANUALLY ENTERED!
  test_loan._id = '59e3f0cd4df2b22034a6e9aa' ;
  
  // Print the found loan to the console
  agent.get('/api/loan/' + test_loan._id).end(function(err, res) { console.log(res.body) ; });
  
  // Update the loan in the database
  agent.put('/api/loan/' + test_loan._id).send(loan_2).end(function(err, res) {}) ;
  
  // Print the found loan to the console
  agent.get('/api/loan/' + test_loan._id).end(function(err, res) { console.log(res.body) ; });
  
  // Delete the loan -> should be removed from the database
  agent.delete('/api/loan/' + test_loan._id).end(function(err, res) {}) ;
  
  // Get a list of all loans and print to the console
  // Should be all loans minus the deleted one
  agent.get('/api/loans/').end(function(err, res) { console.log(res.body) ; }) ;
}