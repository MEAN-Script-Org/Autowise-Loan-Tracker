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
      var results = loans;
      
      loans.forEach(function(item, index, obj) {
        if (item.status.toLowerCase() != 'archived') {
          obj.splice(index, 1);
          // results.push(item);
        }
      });

      return results;
    }
    else
      return loans;
  }
});

angular.module('SWEApp').filter('important_filter', function() {
  return function(loans, active) {

    if (active) {
      var results = loans;

      results.forEach(function(item, index, obj) {
        if (!importants[item.status.toLowerCase()])
        {
          obj.splice(index, 1);
          // console.log(item);
        }
      });
      
      return results;
    }
    else
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