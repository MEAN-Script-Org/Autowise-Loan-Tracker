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
      
      //----------------------------------------------------------------------------------------------------------------
      // Emailing
      //----------------------------------------------------------------------------------------------------------------
      sendEmail: function(updates) {
        var args = Object.assign(updates, {token: getToken()});
        return $http.post('/api/email', args);
      },

      //----------------------------------------------------------------------------------------------------------------
      // Users CRUD
      //----------------------------------------------------------------------------------------------------------------
      newUser: function(User) {
        console.log(User);
        var args = Object.assign(User, {token: getToken()});
        
        return $http.post('/api/users', args).then(
          function(res) {
            addToken(res.data);
            console.log(res.data);
            // $window.location.href = '/login';
          },
          function(err, message) {
            alert(message + err + JSON.stringify(err));
        });
      },
      getUsernames: function() {
        return $http.get('/usernames');
      },
      getAllUsers: function() {
        var args = {token: getToken()};
        return $http.get('/api/users', args);
      },
      getUser: function(id) {
        var args = {token: getToken()};
        return $http.get('/api/user/' + id, args);
      },
      
      // TODO: Implement this
      // getUserInfo: function() {
      //   var args = {token: getToken()};
      //   return $http.get('/api/info', args);
      // },

      //----------------------------------------------------------------------------------------------------------------
      // Loans CRUD
      //----------------------------------------------------------------------------------------------------------------
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
      deleteLoan: function(id) {
        var args = {token: getToken()};
        return $http.delete('/api/loan/' + id, args);
      },
      modifyLoan: function(id, updatedLoan) {
        // var args = {token: getToken()};
        var args = Object.assign(updatedLoan, {token: getToken()});
        return $http.put('/api/loan/' + id, args);
      },
      
      //----------------------------------------------------------------------------------------------------------------
      // CRUD operations on loans of specific Users
      //----------------------------------------------------------------------------------------------------------------
      getLoansOfUser: function() {
        var args = {token: getToken()};
        return $http.get('/api/loansByUser/', args);
      },
      // Bug => get requests don't seem to be accepting args.... interesting

      //----------------------------------------------------------------------------------------------------------------
      // Authentication
      //----------------------------------------------------------------------------------------------------------------
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
      logout: function() {
        removeToken();
        $window.location.href = '/login';
      },
    };
    
    return methods;
  }
]);