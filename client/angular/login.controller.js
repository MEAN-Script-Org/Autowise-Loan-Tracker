angular.module('SWEApp').controller('LoginController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    // GLOBALS
    // $rootScope.users = ['hello'];
    $rootScope.users = [];
    $rootScope.newUser = {};
    $rootScope.usernames = [];

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

    $scope.addUser = function() {
      if (!$rootScope.usernames.includes($rootScope.newUser.username))
        Factory.newUser($rootScope.newUser).then(
          function(realUser) {
            $rootScope.usernames.push(realUser);
          },
          function(err) {
            alert(err);
        });
      else
        alert("Please change your username to one that hasn't been taken");
    }
  }
]);