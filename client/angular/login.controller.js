angular.module('SWEApp').controller('LoginController',
  ['$rootScope', '$scope', '$location', '$window', '$http', 'Factory',
  function($rootScope, $scope, $location, $window, $http, Factory) {

    // GLOBALS
    $scope.newUser = {isAdmin: false};
    $rootScope.users = [];
    // $scope.newUser = {email: "dale", username: "dale"};
    $rootScope.usernames = {};

    $scope.init = function(error_message, type) {
      // Atempt to reroute ASAP
      Factory.isLoggedIn().then(
        function(res) {

          if (res.data.error || error_message || type) {
            // useless error..
            // console.log(res.data.error);
            Factory.removeToken();
          } 
          
          if (Factory.getToken()) {
            // alert("Redirecting to profile.. please wait");
            // setTimeout(function(){$('.alert').alert('close')}, 400);
            window.location.href = '/profile/' + Factory.getToken();
          }
        },
        function(err, error) {
          alert("error when loging in...");
          // alert(JSON.stringify(err) + JSON.stringify(error));
        }
      );

      // I could easily get BOTH, just usernames and all their data...
      // Maybe the username conversion should be a frontend thing... backend logic is screwed up
      Factory.getUsernames().then(
        function(res) {
          // $rootScope.usernames = res.data;
          // console.log(res.data);
          res.data.forEach(function(item) {
            $rootScope.usernames[item] = true;
          });
        }
      //   ,
      //   function(err) {
      //     alert("can't get usernames..");
      // }
      );

      // This works
      // Factory.getAllUsers().then(
      //   function(res) {
      //     $rootScope.users = res.data;
      //   },
      //   function(err) {
      //     alert(err);
      // });
    }

    $scope.login = function() {

      var loginData = {
        username: $scope.username, 
        password: $scope.password,
      };

      Factory.login(loginData).then(
        function(res) {
          if (!res.data.error) {
            // console.log(res.data);
            // console.log(JSON.stringify(res.data));
            
            // check that this works
            Factory.addToken(res.data);
            console.log(Factory.getToken());
            $window.location.href = '/login';
          } else alert(res.data.error);
        },
        function(err) {
          return alert(err);
      });
    }

    $scope.register = function() {
      // TODO: Correctly implement this
      // Affix any dangling loans in the database to this user
      // This should be done in the backend...
      // affixLoans(realUser);

      if (!$rootScope.usernames[$scope.newUser.username])
        Factory.newUser($scope.newUser);
      else
        alert("Please change your username to one that hasn't been taken");
    }

    // // don't waste time on this...
    // $scope.makeUsernameTheEmail = function() {
    //   // make the user email to be username while nothing is types as username, or the email is still the username
    //   console.log($scope.newUser.username);
    //   console.log($scope.newUser.email);

    //   var email = $scope.newUser.email;
    //   var username = $scope.newUser.username;

    //   email.substring(0, Math.min(email.length - 1, username.length - 1));

    //   if (!email || username == email) {
    //     console.log($scope.newUser.username);
    //     console.log($scope.newUser.email);

    //     $scope.newUser.username = $scope.newUser.email;
    //   }
    //   else
    //     console.log("NOPE");
    // }
    
    // Search loans database for loans with matching contact information
    // Affixes these loans to this User
    function affixLoans(user) {
      Factory.getLoansByUserInfo(user).then(
        function(loans) {
          
          // Affix this user's ID to each found loan
          res.loans.forEach(
            function(loan) {
              loan.user_id = user._id ;
              loan.save() ;
            }
          );
        },
        function(err) { console.log(err) ; }
      );
    }
  }
]);