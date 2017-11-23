angular.module('SWEApp').controller('LoginController',
  ['$rootScope', '$scope', '$location', '$window', '$http', 'Factory',
  function($rootScope, $scope, $location, $window, $http, Factory) {

    // GLOBALS
    $rootScope.users = [];
    $rootScope.newUser = {isAdmin: false, isSuperAdmin: false};
    $rootScope.usernames = {};
    $scope.login_page = true;

    $scope.init = function(error_message, type) {
      // Atempt to reroute ASAP
      Factory.isLoggedIn().then(
        function(res) {

          if (res.data.error || error_message || type) {
            // useless error..
            // console.log(res.data.error);
            Factory.removeToken();
          } 
          
          var token_array = Factory.getToken();
          if (token_array) {
            window.location.href = '/profile/' + Factory.getToken();
          }
        },
        function(err, error) {
          alert("error when loging in...");
          // alert(JSON.stringify(err) + JSON.stringify(error));
        }
      );

      Factory.getUsernames().then(
        function(res) {
          res.data.forEach(function(item) {
            $rootScope.usernames[item] = true;
          });
        }
      );
    }

    $scope.login = function() {

      var loginData = {
        username: $scope.username, 
        password: $scope.password,
      };

      Factory.login(loginData).then(
        function(res) {
          if (!res.data.error) {
            Factory.addToken(res.data);
          } else {
            if (res.data.error.indexOf("Invalid") > -1)
            {
              // username it's ok not to be cleared here
              $scope.password = null;
            }

            alert(res.data.error);
          }
        },
        function(err) {
          return alert(err);
      });
    }

    $scope.register = function() {
      
      if (!$rootScope.usernames[$rootScope.newUser.username]) {
        $rootScope.newUser.md5hash = window.fingerprint.md5hash;
        
        Factory.newUser($rootScope.newUser).then(
          function(req) {
            Factory.addToken(req.data);
          }
        );
      }
      else
        alert("Please change your username to one that hasn't been taken");
    }
  }
]);