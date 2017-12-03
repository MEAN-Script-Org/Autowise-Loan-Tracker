exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['protractor.navigation', 'protractor.admin_loan_crud.js']
}