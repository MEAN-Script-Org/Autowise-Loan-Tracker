
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
    }
]);