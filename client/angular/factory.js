angular.module('SWEApp').factory('Factory', ['$http',
  function($http) {
    var methods = {
      getLoans: function() {
        return $http.get('/api/loans');
      },
      sendEmail: function() {
        return $http.post('/api/send');
      },
    };
    return methods;
  }
]);