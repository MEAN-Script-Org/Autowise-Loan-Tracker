
// angular.module('SWEApp').config(['$stateProvider', '$urlRouterProvider', 
//   function($stateProvider) {
//     $stateProvider
//       // .state('Main', {
//       //   abstract: true.
//       //   url: '/', 
//       // }),
//       // .state('Main.counter', {
//       //   url: '/countdown', 
//       // }),
//       // .state('Main.form', {
//       //   url: '/oink', 
//       // }),
//   } 
// ]);

// ['$stateProvider', '$urlRouterProvider' ?

angular.module('appRoutes', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      })

      .when('/about', {
        templateUrl: 'app/views/pages/about.html'
      })

      .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register'
      })

      .when('/login', {
        templateUrl: 'app/views/pages/users/login.html'
      })

      .when('logout', {
        templateUrl: 'app/views/pages/users/logout.html'
      })

      .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

});