angular.module('SWEApp').factory('Factory', ['$http',
  function($http) {
    var methods = {
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
      getIP: function() {
        return $http.get('http://api.ipify.org/');
      },
    };
    return methods;
  }
]);