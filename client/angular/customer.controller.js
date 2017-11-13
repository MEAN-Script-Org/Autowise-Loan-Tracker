angular.module('SWEApp').controller(
  'CustomerController', ['$rootScope', '$scope', '$location', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $timeout, Factory) {

    // GLOBALS
    $rootScope.loans = [];
    $rootScope.loading = false;

    // Get Fields for loan object creation
    Factory.getUserInfo().then(function(response) {
      $scope.commentAsAdmin = false;

      // ## Order Filters ~ !them for ascending order
      $scope.reverse = true;
      $scope.reverse_comments = true;

      // TO Change based on routes~
      // ## User Details
      $rootScope.user_id = response.data._id;
      $rootScope.user_name = response.data.username;
      // $rootScope.user_email = response.data.email;
      $rootScope.user_isAdmin = response.data.isAdmin;
    });
    
    //------------------------------------------------------------------------------------------------------------------
    // Pulls all loans associated with the current user
    //------------------------------------------------------------------------------------------------------------------
    $scope.init = function() {
      $scope.visible = "visible";
      
      console.log("TEST!") ;
      
      // TODO: pull all loans associated with a particular user ID
      var id = "12345" ;
      
      // Loads all loans belonging to the specified user
      Factory.getLoansOfUser(id).then(
        function(res) {
          if (res.data.length != 0) {
            $rootScope.loans = res.data;
            console.log($rootScope.loans);
          }
          
          $timeout(function() {
            $rootScope.loading = false;
          }, 3000);
        }
      );
    }
    
    $scope.emailClient = function(loanID, userEmail, clientName) {

      if (!userEmail) {
        alert("User has no email associated with their account");
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