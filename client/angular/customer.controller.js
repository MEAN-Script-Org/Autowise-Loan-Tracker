angular.module('SWEApp').controller(
  'CustomerController', ['$rootScope', '$scope', '$location', '$window', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $window, $timeout, Factory) {

    // GLOBALS
    $rootScope.loans = [];
    $rootScope.loading = true;

    Factory.getUserInfo().then(
      function(res) {
        $rootScope.user = res.data;
      });

    //------------------------------------------------------------------------------------------------------------------
    // Testing function
    //------------------------------------------------------------------------------------------------------------------
    // $scope.oops = function() {
    //   Factory.getLoan('5a1106ca3854dd0c2cb3d818').then(
    //     function(res) {
    //       console.log(res) ;
    //     },
    //     function(err) { console.log(err) }
    //   );
    // }
    
    //------------------------------------------------------------------------------------------------------------------
    // Pulls all loans associated with the current user
    //------------------------------------------------------------------------------------------------------------------
    $scope.init = function() {
      $scope.visible = "visible";
      $scope.isAdmin = false;
      
      // Loads all loans belonging to the specified user
      Factory.getUserLoans().then(
        function(res) {
          $rootScope.loans = res.data;
          
          console.log("FOUND LOANS:") ;
          console.log(res.data) ;
          
          $timeout(function() {
            $rootScope.loading = false;
          }, 500);
        },
        function(err) {
          console.log(err) ;
        }
      );
      
      // Get user info for the logged-in user
      Factory.getUserInfo().then(
        function(res) {
          $rootScope.user = res.data;
      });
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Sets the path to the warranty plans view
    //------------------------------------------------------------------------------------------------------------------
    $scope.goToWarranties = function(loan_id) {
      $window.location.href = '/profile/warranties/' + loan_id + '/' + Factory.getToken() ;
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

      // UPDATE THIS!
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