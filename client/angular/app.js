// register the modules the application depends upon here
angular.module('SWEApp', []);

var importants = {
  "denied": true,
  "approved": true,
  "received": true,
  "submitted": true,
};

// Customer Angular filters
// Taken from https://scotch.io/tutorials/building-custom-angularjs-filters
angular.module('SWEApp').filter('archived_filter', function() {
  return function(loans, active) {

    if (active) {
      var item = {};
      var size = loans.length;

      // reverse loop, preserves index positions
      for (var index = size-1 ; index > -1 ; index--) {
        item = loans[index];
        if (item.status.toLowerCase() != 'archived') {
          loans.splice(index, 1);
        }
      }
    }

    return loans;
  }
});

angular.module('SWEApp').filter('important_filter', function() {
  return function(loans, active) {

    if (active) {
      var size = loans.length;

      // reverse loop, preserves index positions
      for (var index = size-1 ; index > -1 ; index--) {
        item = loans[index];
        if (!importants[item.status.toLowerCase()]) {
          loans.splice(index, 1);
        }
      }
    }

    return loans;
  }
});


// application configuration 
// app.config(['$urlRouterProvider',
//   function($urlRouterProvider) {
//     // go to the '/listings' URL if an invalid route is provided 
//     // console.log($urlRouterProvider);
//     $urlRouterProvider.otherwise('');
//   }
// ]);
//
// // set the initial state of the application 
// app.run(['$state', 
//   function($state) {
//     console.log($state);
//     $state.go('...');
//   }
// ]);