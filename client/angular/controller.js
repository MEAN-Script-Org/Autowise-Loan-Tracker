angular.module('SWEApp').controller('SWEAppController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    $scope.init = function() {
      console.log("MEAN App on it's way!");
      $scope.state = "Processing";

      $scope.loans = [
        {owner: "SHurtado", _id: "434234230", price: "3332"},
        {owner: "MAbrahantes", _id: "434234235", price: "3333"},
      ];
    }

    $scope.start = function() {
      Factory.getLoans().then(
        function(res) {
          // ~ magic ~
        }
      );
    }

    // leaving this one for now...
    $scope.email = function(isValid) {
      $rootScope.investor.name = $scope.found[$rootScope.investor.gatorlink.toLowerCase()];
      $rootScope.investor.for = money_formatter.format($rootScope.investor.checks*20000);

      Factory.create($rootScope.investor).then(
        function(response) {
          var success = "Your request for " + $rootScope.investor.for + " of our shares has been sent!\nYou'll receive a confirmation email within 2 hours";
          alert(success);
          $scope.reset();
        },
        function(error) {
          console.log(error);
          alert("ERROR! Check the logs");
          $scope.reset();
        }
      );
    };

  }
]);