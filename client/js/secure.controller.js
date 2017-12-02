angular.module('SWEApp').controller(
  'SecureController', ['$rootScope', '$scope', '$window', 'Factory',
  function($rootScope, $scope, $window, Factory) {
    $window.location.href = '/profile/' + Factory.getToken() + "/?{frontend:true}";
  }
]);
