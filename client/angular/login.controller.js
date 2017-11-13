angular.module('SWEApp').controller('LoginController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    // GLOBALS
    // $rootScope.users = ['hello'];
    $rootScope.users = [];
    $rootScope.newUser = {};
    $rootScope.usernames = [];

    // I could easily get BOTH, just usernames and all their data...
    // Maybe the username conversion should be a frontend thing... backend logic is screwed up
    Factory.getUsernames().then(
      function(res) {
        $rootScope.usernames = res.data;
      },
      function(err) {
        alert(err);
    });

    // This works
    // Factory.getAllUsers().then(
    //   function(res) {
    //     $rootScope.users = res.data;
    //   },
    //   function(err) {
    //     alert(err);
    // });
    $scope.init = function(message, type) {
      console.log(message, type);
    }

    $scope.addUser = function() {
      if (!$rootScope.usernames.includes($rootScope.newUser.username))
        Factory.newUser($rootScope.newUser).then(
          function(realUser) {
            $rootScope.usernames.push(realUser);
            
            affixLoans(realUser) ;  // Affix any dangling loans in the database to this user
          },
          function(err) {
            alert(err);
        });
      else
        alert("Please change your username to one that hasn't been taken");
    }
    
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