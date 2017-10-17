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
      getIP: function() {
        return $http.get('http://api.ipify.org/');
      },
    };
    return methods;
  }
]);