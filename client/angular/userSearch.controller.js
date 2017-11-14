angular.module('SWEApp').controller('userSearch',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    Factory.getUsernames().then(
        function(res){
        // the user names are in res.data
        $rootScope.userNames = res.data;
        console.log(res.data);
        
    });
  }
]);