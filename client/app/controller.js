var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

angular.module('SWEApp').controller('SWEAppController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    $scope.range = [1,2,3];
    $rootScope.us = [];
    $rootScope.ids = {};
    $rootScope.found = {};
    $rootScope.investor = {"checks": 1};

    Factory.getIP().then(
      function(res) {
        $rootScope.investor.ip = res.data;
      }
    );

    $scope.reset = function() {
      $rootScope.investor = {"checks": 1, "ip": $rootScope.investor.ip};
      $("#investment_form").modal("hide");
    }

    var update_counter = function() {
      $scope.time_to_go -= 1000;
      t = $scope.time_to_go;

      // Ugly but only way I got it to work ~
      $("#days_left").text(Math.floor(t / (1000 * 60 * 60 * 24)));
      $("#hours_left").text(Math.floor((t / (1000 * 60 * 60)) % 24));
      $("#minutes_left").text(Math.floor((t / 1000 / 60) % 60));
      $("#seconds_left").text(Math.floor((t / 1000) % 60));
    }

    $scope.start = function() {
      Factory.getNames().then(
        function(res) {
          $rootScope.ids = res.data;
          $rootScope.us = $scope.ids.prohibited;
          $rootScope.found = $scope.ids.people;
        }
      );

      Factory.getTime().then(
        function (res) {
          var start_of_bidding = new Date(2017, 9, 10, 12);
          var current_server_time = new Date(res.data.time);
          
          var diff = start_of_bidding - current_server_time;
          $scope.time_to_go = new Date(diff);

          setInterval(update_counter, 1000);
      });
    }

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