angular.module('SWEApp').controller(
  'CustomerController', ['$rootScope', '$scope', '$location', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $timeout, Factory) {

    // GLOBALS
    $rootScope.loans = [];
    $rootScope.loading = true;

    // ## Order Filters ~ !them for ascending order
    $scope.reverse_comments = true;

    // Factory.getUserInfo().then(function(response) {
    // });
    
    //------------------------------------------------------------------------------------------------------------------
    // Pulls all loans associated with the current user
    //------------------------------------------------------------------------------------------------------------------
    $scope.init = function() {
      $scope.visible = "visible";
      $scope.isAdmin = false;
      
      // TODO: pull all loans associated with a particular session user ID
      // 
      // var id = "5a09f3ef17b72328ec7750f6";
      
      // Loads all loans belonging to the specified user
      Factory.getLoansOfUser().then(
        function(res) {
          if (res.data.length != 0) {
            $rootScope.loans = res.data;
            // console.log($rootScope.loans);
          }
          
          $timeout(function() {
            $rootScope.loading = false;
          }, 500);
        },
        function(err) {
          console.log(err) ;
        }
      );
    }

    $scope.logout = function() {
      Factory.logout();
    }

    $scope.emailClient = function(loanID, userEmail, clientName) {

      if (!userEmail) {
        alert("You don't have an email associated with your account.\nPlease add one");
        return;
      }

      var errorMsg = "There was an error sending the email. Please check the logs";

      // Generic message will do for now...
      var bodyMessage = "You have an update on your loan application.";
      var email = {
        id: loanID,
        to: userEmail,
        name: clientName,
        message: bodyMessage,
      };

      Factory.sendEmail(email).then(
        function(response) {
          // this can be changed later to not trigger the alert
          //    and just do sucess messages like Assignments
          if (response.data.error) {
            console.log(response.data.error);
            alert(errorMsg);
          } else {
            alert("Notification email sent to " + userEmail + "!");
          }
        },
        function(error) {
          console.log(error);
          alert(errorMsg);
        });
    };
  }
]);