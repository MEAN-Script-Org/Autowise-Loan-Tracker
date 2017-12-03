
//======================================================================================================================
// TEST GROUP III - GENERAL NAVIGATION
//======================================================================================================================
describe('TEST GROUP III - GENERAL NAVIGATION: ', function() {
  
  //--------------------------------------------------------------------------------------------------------------------
  // HELPER FUNCTIONS
  //--------------------------------------------------------------------------------------------------------------------
  
  // Returns an object containing several navigational web elements
  var extractElements = function() {
    return {
      navMenu:   element(by.id('user-action-toggle')),
      navItems: [
        loans:   element(by.id('nav-loans')),
        account: element(by.id('nav-account')),
        manage:  element(by.id('nav-manage')),
        logout:  element(by.id('nav-logout')),
      ],
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
  
  // Before all tests, load the admin hub page
  beforeAll(function() {
    browser.get('http://localhost:5001/') ;
    
    // Fill out username and password fields
    element(by.model('username')).sendKeys('super') ;
    element(by.model('password')).sendKeys('admin') ;
    
    // Click 'Login' button
    element(by.buttonText('Login')).click() ;
    
    browser.waitForAngular() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #3.0: Select all navigation options
  //--------------------------------------------------------------------------------------------------------------------
  it('Test #3.0: Select all navigation options', function() {
    console.log('Test #3.0: Select all navigation options') ;
    
    var E = extractElements() ;
    
    for (item in E.navItems) {
    
      // Click on nav menu to open up options
      E.navMenu.click() ;
      
      // Click on the corresponding option and load the new page
      item.click() ;
      
      // Verify page title is the destination page
      //expect(LE.loanHeader.getText()).toContain('Oswald the Lucky') ;
    }
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