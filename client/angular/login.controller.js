angular.module('SWEApp').controller('LoginController',
  ['$rootScope', '$scope', '$location', '$window', '$http', 'Factory',
  function($rootScope, $scope, $location, $window, $http, Factory) {

    // GLOBALS
    $rootScope.users = [];
    $rootScope.newUser = {isAdmin: false, isSuperAdmin: false};
    $rootScope.usernames = {};

    $scope.init = function(error_message, type) {
      $scope.login_page = true;
      
      $scope.rn = new Date().getTime();
      $scope.already_typed = false;
      $scope.funny_dob = false;
      $scope.funny_dob_message = "nothing so far";

      // Atempt to reroute ASAP
      Factory.isLoggedIn().then(
        function(res) {

          if (res.data.error || error_message || type) {
            // useless error..
            // console.log(res.data.error);
            // if (type != "btn-danger")
              Factory.removeToken();
          } 
          
          var token_array = Factory.getToken();
          if (token_array) {
            window.location.href = '/profile/' + token_array;
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

    $scope.typedVerification = function() {
      $scope.already_typed = true;
    }
    
    $scope.checkDOB = function() {
      var day = 1000 * 60 * 60 * 24;
      var year = Math.floor(day * 365.25);
      var diff = Math.floor($scope.rn - $scope.newUser.dob.getTime());
      // alert(diff + "\n" + diff/year);

      if (diff > 18 * year && diff < 115 * year) {
        $scope.funny_dob = false;
      }
      else {
        $scope.funny_dob = true;
        if (diff < 0)
          $scope.funny_dob_message = "Are you sure you haven't been born yet?";
        else if (diff < 18 * year)
          $scope.funny_dob_message = "Are you sure you're younger than 18?";
        else if (diff > 115 * year) {
          var age = Math.floor(diff / year);
          $scope.funny_dob_message = "Are you sure you're " + age + " years old?";
        }
      }
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

      // if (false)
      //   ;
      if ($rootScope.newUser.verify != $rootScope.newUser.password)
        alert("Please verify your password");
      else if ($rootScope.usernames[$rootScope.newUser.username]) 
        alert("Please change your username to one that hasn't been taken");
      else if ($scope.funny_dob) 
        alert("Please fix your DOB");
      else {
        $rootScope.newUser.md5hash = window.fingerprint.md5hash;
        
        // on good, add token and tada!
        Factory.newUser($rootScope.newUser);
      }
    }
  }
]);