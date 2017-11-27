
//======================================================================================================================
// TEST GROUP I - ADMINISTRATOR LOAN CRUD
//======================================================================================================================
describe('TEST GROUP I - ADMINISTRATOR LOAN CRUD', function() {
  var loans = element.all(by.repeater('loan in filtered_loans')) ;
  
  var searchBar    = element(by.id('search')) ;
  
  var buttonStatus = loans.first().element(by.id('action-status')) ;
  var buttonEdit   = loans.first().element(by.id('action-edit')) ;
  
  var buttonUpdateStatus = element(by.id('update-status')) ;
  
  var statusDropdown = element(by.model('newStatus')) ;
  
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
    browser.get('http://localhost:5001/profile/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMGI3ZTZlM2NmMDkyMWRkYzZjOWQ5NSIsIm5hbWUiOiJUeWxlciBCYXJrbGV5IiwiZW1haWwiOiJ0YkBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VybmFtZSI6InR5bGVyIiwibWQ1aGFzaCI6IjhhYzg3OTY5MjQ5OGYzZGZiNWQ3NmM1NTViNTQzYzhiIiwiaWF0IjoxNTExNzU1MDIwLCJleHAiOjE1MTE3NjU4MjB9.woQdSdpbETudIlbMnSLhjfArHrx2N4C0ws-4R5ln6OQ,8ac879692498f3dfb5d76c555b543c8b');
    browser.waitForAngular() ;
  });
  
  //--------------------------------------------------------------------------------------------------------------------
  // Test #1.0: ???
  //--------------------------------------------------------------------------------------------------------------------
  it('Update status', function() {
    browser.pause() ;
    
    expect(element(by.id('loans-array')).isPresent()).toBe(true) ;
    
    // Open 'change status' modal dialog
    buttonStatus.click() ;
    
    // Select 'Pending' as the new status
    selectDropdownItem(statusDropdown, 2) ;
    
    // Confirm new status
    buttonUpdateStatus.click() ;
    
    // Verify that loan status has been changed to 'Pending'
    expect(loans.first().getText()).toContain('Pending') ;
  });
});