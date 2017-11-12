//uses classList, setAttribute, and querySelectorAll
//if you want this to work in IE8/9 youll need to polyfill these

// Wrapping original js content in angular controller
angular.module('SWEApp').controller('AccordFuncController', 
  ['$scope', '$location', 'Factory',
  function($scope, $location, Factory) {

    // gets called when accordion is clicked, passes loanID to update checkList if stateUpdate holds that it has checked/or unchecked a checkbox
    $scope.checkTrigger = function(loanID) {
      let stateUpdate = $("#" + loanID + "-checkbox")[0].checked;
      if (stateUpdate != -1) {
        $scope.$parent.updateCheckList(loanID, stateUpdate);
      }
    };
      
    // search function for specifying loan criteria
    $scope.search = function(loan) {
      
      // this retrieves the MAIN parent controller's scope of the application (crud.controller.js)
      let parentScope = $scope.$parent.$parent.$parent;

      //this returns a boolean value to see if the nameCheckbox (or any of the other attributes) has been selected in the parent's searchScopes variable
      //this allows us to verify which of the loan attributes we are searching for
      var nameCheckbox = parentScope.searchScopes.indexOf("nameCheckbox") === -1 ? false : true;
      var emailCheckbox = parentScope.searchScopes.indexOf("emailCheckbox") === -1 ? false : true;
      var lenderCheckbox = parentScope.searchScopes.indexOf("lenderCheckbox") === -1 ? false : true;
      var dateCheckbox = parentScope.searchScopes.indexOf("dateCheckbox") === -1 ? false : true;

      //find queried value in specified fields, this tests to see if we can match what is in the search box ($scope.query) and to a loan's selected attribute
      let queryVal = angular.lowercase($scope.query);
      // IE doesn't like this... not like it matters thou ~ unless their customers are OLD DUST
      var nameMatch = loan.name.toLowerCase().includes(queryVal);

      //the other fields can work once the loan object has the COMPLETE model information from the buyer order: email, lender info, form_date

      //        var emailMatch = loan.purchase_order.email.toLowerCase().includes(queryVal);
      //        var lenderMatch = loan.purchase_order.car_info.lender.toLowerCase().includes(queryVal);
      //        var dateMatch = loan.purchase_order.form_date.toLowerCase().includes(queryVal);

      //        || (emailCheckbox && emailMatch) || (lenderCheckbox && lenderMatch) || (dateCheckbox && dateMatch)

      //         console.log(nameMatch)// + " " + emailMatch + " " + lenderMatch + " " + dateMatch);
        
      //return true (true means return those individual loans that match) if there is nothing in the query (empty) or if there is a SELECTED match
      // console.log(emailCheckbox, $scope.query);

      return !$scope.query || (nameCheckbox && nameMatch);
      // if (!$scope.query || (nameCheckbox && nameMatch)) {
      //   return true;
      // }
      // return false;
    };

    // IIFE Immediately Invokable Function Expression
    // calls function immediately when the javascript is rendered.

  }
]);