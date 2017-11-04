angular.module('SWEApp').factory('Factory', ['$http',
  function($http) {
    var methods = {
      // Emailing
      sendEmail: function(updates) {
        return $http.post('/api/email', updates);
      },
      // Uers CRUD
      newUser: function(User) {
        return $http.post('/api/users', User);
      },
      getUsernames: function() {
        return $http.get('/api/users');
      },
      getUser: function(id) {
        return $http.get('/api/user/' + id);
      },
      getUserInfo: function() {
        return $http.get('/api/info');
      },

      // Loans CRUD
      newLoan: function(loan) {
        return $http.post('/api/loans', loan);
      },
      getLoans: function() {
        return $http.get('/api/loans');
      },
      getLoan: function(id) {
        return $http.get('/api/loan/' + id);
      },
      deleteLoan: function(id) {
        return $http.delete('/api/loan/' + id);
      },
      modifyLoan: function(id, updatedLoan) {
        return $http.put('/api/loan/' + id, updatedLoan);
      },
    };
    return methods;
  }
]);