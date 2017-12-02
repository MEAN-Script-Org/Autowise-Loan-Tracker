
angular.module('SWEApp').controller('Navigation', ['$rootScope', '$scope', '$location', '$window', 'Factory',
  function($rootScope, $scope, $location, $window, Factory) {
    
    //--------------------------------------------------------------------------------------------------------------------
    // Navigates to the page as specified by the 'key'
    //--------------------------------------------------------------------------------------------------------------------
    $scope.goTo = function(key) {
      var url = '' ;
      var token = Factory.getToken() ;
      
      // Determine URL from specified key
      switch (key) {
        case 'loans'   : url = '/profile/'             + token ; break ;
        case 'account' : url = '/profile/userinfo/'    + token ; break ;
        case 'perm'    : url = '/profile/permissions/' + token ; break ;
        default        : ;
      }
      
      // Assign URL and load destination page
      $window.location.href = url ;
    }
    
    //--------------------------------------------------------------------------------------------------------------------
    // Logs the current user out
    //--------------------------------------------------------------------------------------------------------------------
    $scope.logout = function() {
      Factory.logout();
    }
  }
]);