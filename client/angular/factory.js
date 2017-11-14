angular.module('SWEApp').factory('Factory', ['$http', '$window',
  function($http, $window) {
    
    var addToken = function(token) {
        $window.localStorage.setItem('token', token);
    }

    var getToken = function() {
      var token = $window.localStorage.getItem('token');
      return token;
    }

    var removeToken = function() {
      $window.localStorage.removeItem('token');
    }

    var methods = {
      
      // Emailing
      sendEmail: function(updates) {
        var args = Object.assign(updates, {token: getToken()});
        return $http.post('/api/email', args);
      },

      // Users CRUD
      newUser: function(User) {
        console.log(User);
        var args = Object.assign(User, {token: getToken()});
        return $http.post('/api/users', args);
      },
      getUsernames: function() {
        var args = {token: getToken()};
        return $http.get('/api/usernames', args);
      },
      getAllUsers: function() {
        var args = {token: getToken()};
        return $http.get('/api/users', args);
      },
      getUser: function(id) {
        var args = {token: getToken()};
        return $http.get('/api/user/' + id, args);
      },
      getUserInfo: function() {
        var args = {token: getToken()};
        return $http.get('/api/info', args);
      },

      // Loans CRUD
      newLoan: function(loan) {
        var args = Object.assign(loan, {token: getToken()});
        return $http.post('/api/loans', args);
      },
      getLoans: function() {
        var args = {token: getToken()};
        return $http.get('/api/loans', args);
      },
      getLoan: function(id) {
        var args = {token: getToken()};
        return $http.get('/api/loan/' + id, args);
      },
      getLoansOfUser: function(user_id) {
        var args = {token: getToken()};
        return $http.get('/api/loans/' + user_id, args);
      },
      getLoansByUserInfo: function(User) {
        var args = Object.assign(User, {token: getToken()});
        return $http.get('/api/loansByUserInfo', args);
      },
      deleteLoan: function(id) {
        var args = {token: getToken()};
        return $http.delete('/api/loan/' + id, args);
      },
      modifyLoan: function(id, updatedLoan) {
        var args = {token: getToken()};
        var args = Object.assign(updatedLoan, {token: getToken()});
        return $http.put('/api/loan/' + id, args);
      },
      // Bug => get requests don't seem to be accepting args.... interesting

      // Authentication
      addToken: function(token) {
        addToken(token);
      },
      getToken: function() {
        return getToken();
      },
      removeToken: function() {
        removeToken();
      },
      register: function(loginData) {
        return $http.post('/api/users', loginData);
      },
      login: function(loginData) {
        return $http.post('/login', loginData);
      },
      isLoggedIn: function() {
        var token = getToken();
        // console.log(token);
        return $http.get('/api/auth', {token, no_next: true});
      },
      logout: function() {
        removeToken();
        $window.location.href = '/login';
      },
    };
    
    return methods;
  }
]);