
//======================================================================================================================
// TEST GROUP I - ADMINISTRATOR LOAN CRUD
//======================================================================================================================
describe('TEST GROUP I - ADMINISTRATOR LOAN CRUD', function() {
  
  //--------------------------------------------------------------------------------------------------------------------
  // HELPER FUNCTIONS
  //--------------------------------------------------------------------------------------------------------------------
  
  // Selects the item 'optionNum' from the specified dropdown list specified by 'element'
  // Borrowed from https://technpol.wordpress.com/2013/12/01/protractor-and-dropdowns-validation/
  var selectDropdownItem = function (element, index) {
    if (index){
      var options = browser.findElements(by.tagName('option'))   
        .then(function(options){
          options[index].click();
        });
    }
  };
  
  //--------------------------------------------------------------------------------------------------------------------
  // TESTING FUNCTIONS
  //--------------------------------------------------------------------------------------------------------------------
  
  // Before each test, load the admin hub page
  beforeEach(function() {
    browser.get('http://autowise.herokuapp.com/login') ;
    
    // Fill out username and password fields
    element(by.model('username')).sendKeys('tyler') ;
    element(by.model('password')).sendKeys('123') ;
    
    // Click 'Login' button
    element(by.buttonText('Login')).click() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.0: ???
  //--------------------------------------------------------------------------------------------------------------------
  it('Update status', function() {
    var loans = element.all(by.repeater('loan in filtered_loans'));
    var loan = loans.first() ;
    
    //var searchBar    = element(by.id('search')) ;
    
    CAN't USE IDs DUMMY
    
   // var buttonStatus = loan.element(by.id('action-status')) ;
   // var buttonEdit   = loan.element(by.id('action-edit')) ;
    
    //var buttonUpdateStatus = element(by.id('update-status')) ;
    
    //var statusDropdown = element(by.model('newStatus')) ;
    
    console.log("LOANS: ") ;
    //console.log(loans.count()) ;
    //console.log(loan.element.getText()) ;
    
    // Open 'change status' modal dialog
    //buttonStatus.click() ;
    
    // Select 'Pending' as the new status
    //selectDropdownItem(statusDropdown, 2) ;
    
    // Confirm new status
    //buttonUpdateStatus.click() ;
    
    // Verify that loan status has been changed to 'Pending'
    expect(loans.count()).toEqual(3) ;
    //expect(loan.getText()).toContain('Pending') ;
  });
});