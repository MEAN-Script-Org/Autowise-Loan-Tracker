angular.module('SWEApp').factory('Factory', ['$http',
  function($http) {
    var methods = {
      getUserInfo: function() {
        return $http.get('/api/info');
      },
      getLoans: function() {
        return $http.get('/api/loans');
      },
      newLoan: function(loan) {
        return $http.post('/api/loans', loan);
      },
      deleteLoan: function(id) {
        return $http.delete('/api/loan/' + id);
      },
      newComment: function(id, newComment ) {
        return $http.put('/api/newComment/' + id, {newComment});
      },
      sendEmail: function(updates) {
        return $http.post('/api/email', updates);
      },
    };
    return methods;
  }
]);