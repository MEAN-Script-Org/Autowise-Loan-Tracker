
angular.module('SWEApp').controller('UserAccounts', ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {
      
      // GLOBALS
      $rootScope.user = {} ;    // Currently logged-in user
      
      $scope.init = function() {
        
        // Fetch user information
        Factory.getUserInfo().then(
        function(res) {
          $rootScope.user = res.data; console.log(res.data) ;
        });
      }

      $scope.changePasswordSubmit = function(pwd, pw1, pw2) {

        if (pw1 == pw2) {
          alert("New password is: '" + pw1 + "'");
        }

        else {
          alert("Passwords do not match!")
        } 
      }

      $scope.resetForm = function() {
     //$scope.resetme.reset();
        document.getElementById('resetme').reset();
      };

    }
]);