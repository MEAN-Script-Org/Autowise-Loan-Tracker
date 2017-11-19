// angular wrapper for javascript
angular.module('SWEApp').controller('CheckController', 
  ['$scope', '$location', 'Factory',
  function($scope, $location, Factory) {

    // IIFE
    (function(window) {

      'use strict';

      ////// FOR FILTER DISABLING //////
      var currentCheckCount = 0;
        
      // count number of checkboxes
      $(":checkbox.filter-cb").each(function(index) {
        currentCheckCount = currentCheckCount + 1;
        console.log(this);
      });

      let totalCheckCount = currentCheckCount;
      currentCheckCount = 0;

      // disable the search bar initially
      $('.disabler').addClass('disable');
        
      // keep if checkbox has a state of change
      $(":checkbox.filter-cb").change(function(index) {
        let getId = this.id;

        // if it is in a checked state, increment amount of checked boxes, open search bar if not handled already, add checkbox id to searchScopes array in the parent controller crud.controller.js
        if (this.checked) {
          currentCheckCount = currentCheckCount + 1;
          $('.sb-search').addClass('sb-search-open');
          $scope.$parent.searchScopes.push(getId);

        } else {
          
          // decrement count of checked boxes
          currentCheckCount = currentCheckCount - 1;
            
          // search for id in parent controller searchScopes array and remove it
          angular.forEach($scope.$parent.searchScopes, function(value, key) {
            if (value === getId) {
              $scope.$parent.searchScopes.splice(key, 1);
              return;
            }
          });
        }

        // if no check boxes set, disable search bar and clear out input 
        // TODO : figure out how to clear out query as well
        if (currentCheckCount === 0) {
          $('.disabler').addClass('disable');
          $('.sb-search').removeClass('sb-search-open');
          $('.sb-search-input').val('');
        } else { $('.disabler').removeClass('disable'); }
      });
      ////// END FILTER DISABLING //////
    })();
  }
]);