angular.module('SWEApp').factory('Factory', ['$http', '$window',
  function($http, $window) {
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
        return $http.get('/api/usernames');
      },
      getAllUsers: function() {
        return $http.get('/api/users');
      },
      getUser: function(id) {
        return $http.get('/api/user/' + id);
      },
      getUserInfo: function() {
        return $http.get('/api/info');
      },
      removeUser: function(userId){
        //var token = getToken();
        return $http.delete('/api/user/'+userId);
      },
      makeSuperAdmin: function(userId){
        //var token = getToken();
        return $http.post('/api/user/'+userId);
      },
      makeAdmin: function(userId){
        //var token = getToken();
        return $http.post('/api/user/'+userId);
      },
      makeUser: function(userId){
        //var token = getToken();
        return $http.post('/api/user/'+userId);
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

      // AUTH METHODS
      // Adds token to local storage
      addToken: function(token) {
        $window.localStorage.setItem('token', token);
      },

      removeToken: function() {
        $window.localStorage.removeItem('token');
      },

      logout: function() {
        this.removeToken();
        $http.get('/');
      },

      getToken: function() {
        var token = $window.localStorage.getItem('token');
        console.log(token);
        return token;
      },

      isLoggedIn: function() {
        return true ? this.getToken() : false;
      },

      login: function(loginData) {
        return $http.post('/api/authenticate', loginData).then(function(res) {
          if (res.data.token) {
            console.log(res.data.token);
            this.addToken(res.data.token);
            return res;
          } else alert(res.data.err);
        });
      },

      getUser: function() {
        var token = this.getToken();

        if (token) {
          return $http.post('/api/me', { token });
        } else {
          $q.reject({ message: 'USer has no token' });
        }
      },

      request: function(config) {
        var token = this.getToken();
        if (token) config.headers['x-access-token'] = token;
        return config;
      },

    };
    
    return methods;
  }
]);