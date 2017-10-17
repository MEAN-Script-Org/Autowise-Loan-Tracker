angular.module('SWEApp').factory('Factory', ['$http',
  function($http) {
    var methods = {
      getLoans: function() {
        return $http.get('/api/loans');
      },
      // Old ones below
      create: function(mensaje) {
        console.log(mensaje);
        return $http.post('/api', mensaje);
      },
      getTime: function() {
        return $http.get('/api/time');
      },
      getNames: function() {
        return $http.get('/api/people');
      },
      getLoans: function() {
        return $http.get('/api/loans');
      },
      getUsers: function() {
        return $http.get('/api/users');
      },
      getIP: function() {
        return $http.get('http://api.ipify.org/');
      },
    };
    return methods;
  }
]);