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
        return $http.post('/api/email', Object.assign(updates, token));
      },
      // Uers CRUD
      newUser: function(User) {
        console.log(User);
        return $http.post('/api/users', Object.assign(User, {token: getToken()}));
      },
      getUsernames: function() {
        return $http.get('/api/usernames', {token: getToken()});
      },
      getAllUsers: function() {
        return $http.get('/api/users', {token: getToken()});
      },
      getUser: function(id) {
        return $http.get('/api/user/' + id, {token: getToken()});
      },
      getUserInfo: function() {
        return $http.get('/api/info', {token: getToken()});
      },

      // Loans CRUD
      newLoan: function(loan) {
        return $http.post('/api/loans', Object.assign(loan, {token: getToken()}));
      },
      getLoans: function() {
        return $http.get('/api/loans', {token: getToken()});
      },
      getLoan: function(id) {
        return $http.get('/api/loan/' + id, {token: getToken()});
      },
      getLoansOfUser: function(user_id) {
        return $http.get('/api/loans/' + user_id);
      },
      getLoansByUserInfo: function(user) {
        return $http.get('/api/loansByUserInfo', user);
      },
      deleteLoan: function(id) {
        return $http.delete('/api/loan/' + id, {token: getToken()});
      },
      modifyLoan: function(id, updatedLoan) {
        return $http.put('/api/loan/' + id, Object.assign(updatedLoan, {token: getToken()}));
      },

      // AUTH METHODS
      // Adds token to local storage
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

      // no idea why these are used for....
      // getUser: function() {
      //   var token = this.getToken();

      //   if (token) {
      //     return $http.get('/api/users' + token.id, { token });
      //   } else {
      //     $q.reject({ message: 'User has no token' });
      //   }
      // },

      // no idea what was the use of this...
      // request: function(config) {
      //   // var token = this.getToken();
      //   if (token) config.headers['x-access-token'] = token;
      //   return config;
      // },
    };
    
    return methods;
  }
]);