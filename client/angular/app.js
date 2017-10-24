// register the modules the application depends upon here
angular.module('SWEApp', []);

// register the application and inject all the necessary dependencies 
var app = angular.module('SWEAppController', ['ui.router', 'SWEApp']);

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