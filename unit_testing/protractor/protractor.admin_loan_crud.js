
//======================================================================================================================
// TEST GROUP I - ADMINISTRATOR LOAN CRUD
//======================================================================================================================
describe('TEST GROUP I - ADMIN LOAN CRUD: ', function() {
  
  //--------------------------------------------------------------------------------------------------------------------
  // HELPER FUNCTIONS
  //--------------------------------------------------------------------------------------------------------------------
  
  // Returns an object containing several loan web elements
  var extractLoanElements = function() {
    var loans = element.all(by.repeater('loan in filtered_loans')) ;
    var loan = loans.first() ;
    
    return {
    
      // Top-level loan elements
      loans: loans,
      loan:  loan,
      
      // Within-loan elements
      loanHeader:     loan.element(by.css('.loanHeader')),
      warrantyBar:    loan.element(by.css('.warranty-bar')),
      buttonStatus:   loan.element(by.id('action-status')),
      buttonEdit:     loan.element(by.id('action-edit')),
      buttonWarranty: loan.element(by.id('action-warranty')),
      buttonEmail:    loan.element(by.id('action-email')),
      
      // Modal elements
      buttonUpdateStatus:   element(by.id('update-status')),
      buttonUpdateBO:       element(by.id('bo-update')),
      buttonUpdateWarranty: element(by.id('update-warranty')),
      statusDropdown:       element(by.id('status-dropdown')),
      nameField:            element(by.id('customer-name')),
      monthsFiled:          element(by.id('warranty-months')),
    } 
  }
  
  // Selects the specified loan status from the dropdown list specified by 'element'
  // One must click the dropdown menu and THEN proceed to click the dropdown item, it seems
  var selectDropdownStatus = function (element, status) {
    element.click() ;
    element.element(by.css('option[value=' + status + ']')).click();
  };
  
  //--------------------------------------------------------------------------------------------------------------------
  // TESTING FUNCTIONS
  //--------------------------------------------------------------------------------------------------------------------
  
  // Before all tests, load the admin hub page and assign 
  beforeAll(function() {
    browser.get('http://localhost:5001/login') ;
    
    // Fill out username and password fields
    element(by.model('username')).sendKeys('tyler') ;
    element(by.model('password')).sendKeys('123') ;
    
    // Click 'Login' button
    element(by.buttonText('Login')).click() ;
    
    browser.waitForAngular() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.0: Loan status updates
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.0: Loan status updates', function() {
    console.log('Test #1.0: Loan status updates') ;
    
    var LE = extractLoanElements() ;
    
    // Expand loan accordion
    LE.loanHeader.click() ;
    
    // Open 'change status' modal dialog
    LE.buttonStatus.click() ;
    
    // Select 'Pending' as the new status
    selectDropdownStatus(LE.statusDropdown, 'PENDING') ;
    
    // Confirm new status
    LE.buttonUpdateStatus.click() ;
    
    // Verify that loan status has been changed to 'Pending'
    expect(LE.loanHeader.getText()).toContain('PENDING') ;
    
    // Collapse loan accordion
    LE.loanHeader.click() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.1: Loan buyer's order editing
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.1: Loan buyer\'s order editing', function() {
    console.log('Test #1.1: Loan buyer\'s order editing') ;
    
    var LE = extractLoanElements() ;
    
    // Expand loan accordion
    LE.loanHeader.click() ;
    
    // Open 'edit buyer's order' modal dialog
    LE.buttonEdit.click() ;
    
    // Overwrite name field
    LE.nameField.clear() ;
    LE.nameField.sendKeys('Oswald the Lucky Rabbit') ;
    
    // Confirm updated buyer's order
    LE.buttonUpdateBO.click() ;
    
    // Confirm alert
    browser.driver.sleep(500) ;
    browser.switchTo().alert().accept() ;
    
    // Verify that name on buyer's order has changed
    // The entire name won't fit on the header
    expect(LE.loanHeader.getText()).toContain('Oswald the Lucky') ;
    
    // Collapse loan accordion
    LE.loanHeader.click() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.2: Loan warranty editing
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #1.2: Loan warranty editing', function() {
    console.log('Test #1.2: Loan warranty editing') ;
    
    var LE = extractLoanElements() ;
    
    // Expand loan accordion
    LE.loanHeader.click() ;
    
    // Open 'update warranty' modal dialog
    LE.buttonWarranty.click() ;
    
    // Overwrite months field
    LE.monthsFiled.clear() ;
    LE.monthsFiled.sendKeys('48') ;
    
    // Confirm updated warranty plan
    LE.buttonUpdateWarranty.click() ;
    
    // Confirm alert
    browser.driver.sleep(500) ;
    browser.switchTo().alert().accept() ;
    
    // Verify that months on warranty has been added/changed
    expect(LE.warrantyBar.getText()).toContain('48') ;
    
    // Collapse loan accordion
    LE.loanHeader.click() ;
  });
});