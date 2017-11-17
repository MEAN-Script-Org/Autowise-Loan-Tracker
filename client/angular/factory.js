angular.module('SWEApp').factory('Factory', ['$http', '$window',
  function($http, $window) {
    
    var addToken = function(token) {
        $window.localStorage.setItem('token', token);
    }

    var getToken = function() {

      var token = $window.localStorage.getItem('token');
      if (token)
        token = [token, $window.fingerprint.md5hash];
      return token;
    }

    var removeToken = function() {
      $window.localStorage.removeItem('token');
    }

    // READ:
    //      DO NOT MAKE 'GET' METHODS THAT HANDLE TOKENS!!!! THEY DON'T WORK!
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

        return $http.get('/usernames');
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
      // TODO: Implement this
      // getUserInfo: function() {
      //   var args = {token: getToken()};
      //   return $http.get('/api/info', args);
      // },

      // Loans CRUD
      newLoan: function(loan) {
        var args = Object.assign(loan,   {token: getToken()});
        return $http.post('/api/loans', args);
      },
      getLoans: function() {
        var args = {token: getToken()};
        return $http.put('/api/loans', args);
      },
      getLoan: function(id) {
        var args = {token: getToken()};
        return $http.get('/api/loan/' + id, args);
      },

      // getLoansOfUser: function(user_id) {
      //   var args = {token: getToken()};
      //   return $http.get('/api/loans/' + user_id, args);
      // },
      
      getLoansOfUser: function() {
        // var args = Object.assign();
        var args = {token: getToken()};
        return $http.post('/api/loansByUserInfo/', args);
      },
      deleteLoan: function(id) {
        return $http.delete('/api/loan/' + id);
      },
      modifyLoan: function(id, updatedLoan) {
        // var args = {token: getToken()};
        var args = Object.assign(updatedLoan, {token: getToken()});
        return $http.put('/api/loan/' + id, args);
      },

      // AUTH METHODS
      // Adds token to local storage
      addToken: function(token) {
        $window.localStorage.setItem('token', token);
      },

      removeToken: function() {
        $window.localStorage.removeItem('token');
      },
      register: function(loginData) {
        var args = Object.assign(loginData, {md5hash: window.fingerprint.md5hash});
        console.log(args);
        return $http.post('/api/users', args);
      },
      login: function(loginData) {
        var args = Object.assign(loginData, {md5hash: window.fingerprint.md5hash});
        console.log(args);
        return $http.post('/login', args);
      },

      isLoggedIn: function() {
        var token = getToken();
        // console.log(token);
        return $http.post('/api/auth', {token});
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