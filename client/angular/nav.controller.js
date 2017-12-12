angular.module('SWEApp').controller('Navigation', 
  ['$rootScope', '$scope', '$location', '$window', 'Factory',
  function($rootScope, $scope, $location, $window, Factory) {
    
    // Security check
    if (!$scope.login_page && !Factory.getToken()) {
      window.location.href = "/profile/badtoken";
    }
    else {
      var website = window.location.href;
      var isNotSececure = website.indexOf("https") < 0;
      var isNotRunningLocally = website.indexOf("localhost") < 0;

      if (isNotSececure && isNotRunningLocally)
        window.location.href = "https" + website.slice(4);
    }
    
    //--------------------------------------------------------------------------------------------------------------------
    // Navigates to the page as specified by the 'key'
    //--------------------------------------------------------------------------------------------------------------------
    $scope.goTo = function(key) {
      var url = '' ;
      var token = Factory.getToken() ;
      
      // Determine URL from specified key
      switch (key) {
        case 'loans'   : url = '/profile/'             + token ; break ;
        case 'account' : url = '/profile/account/'     + token ; break ;
        case 'perm'    : url = '/profile/permissions/' + token ; break ;
        default        : ;
      }
      
      // Assign URL and load destination page
      if ($window.location.pathname != url){
        $window.location.href = url ;
      }
    }
    
    //--------------------------------------------------------------------------------------------------------------------
    // Logs the current user out
    //--------------------------------------------------------------------------------------------------------------------
    $scope.logout = function() {
      Factory.logout();
    }
  }
]);