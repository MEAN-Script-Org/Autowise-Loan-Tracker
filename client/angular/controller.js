angular.module('SWEApp').controller('EmailTestController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    Factory.getUserInfo().then(function(response) {
      // Globals
      $rootScope.loans = [];
      $rootScope.user_id = response.data._id;
      $rootScope.user_email = response.data.email;
    });

    $scope.init = function() {
      console.log("MEAN App on it's way!");
      
      // Declared models
      $scope.state = "Processing";
      $scope.newLoan = {};
      
      Factory.getLoans().then(
        function(res) {
          if (res.data.length != 0){
            $rootScope.loans = res.data;
          }
          else {
            console.log("DB is empty ~");
          }
        }
      );
    }

    $scope.removeLoan = function(loanID) {
      // trigger modal.... THEN this
      // Delete should send things to archieve...
      //        Delete from DB, Add to 'archieve.json'
      Factory.deleteLoan(loanID).then(
        function(response) {
          // update frontend
          $rootScope.loans.some(function(item, index, loans) {
            if (item._id) {
              if (item._id == loanID) {
                loans.splice(index, 1);
                return true;
              }
            }
          });

          alert("Successfully deleted loan");
        },
        function(err) {
          alert("Error deleting loan. Perhaps it was already deleted");
          console.log(err);
        }
      );
    }

    $scope.addLoan = function() {
      // Assigning foreign elements
      $scope.newLoan.user_id = $rootScope.user_id;
      $scope.newLoan.user_email = $rootScope.user_email;
        
      Factory.newLoan($scope.newLoan).then(
        function(response) {
          if (response.data) {
            $rootScope.loans.unshift(response.data);
            console.log("Returned new loan: ");
            console.log(response.data);

            // clear form data once done
            $scope.newLoan = {};
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }

    $scope.addComment = function(loanID) {
      /*
        Marcial, Style comment:
          The following uses jQuery
          It'll be better if it was in Angular style
            if anyone finds a way to do the "Angular way", change it
            just make sure to update the view logic as well
      */
      var wantedInputField = "#" + loanID + "-new-comment";
      var newComment = $(wantedInputField).val();
      $(wantedInputField).val("");
      // saving text message content, clearing input field

      // update frontend
      $rootScope.loans.some(function(item, index, loans) {
        if (item._id) {
          if (item._id == loanID) {
            loans[index].comments.push(newComment);
            return true;
          }
        }
      });

      // and DB
      Factory.newComment(loanID, newComment).then(
        function(res) {
          console.log("Returned new loan with updated comments:");
          console.log(res.data);
      });
    }

    $scope.emailClient = function(loanID, userEmail) {
      // Trigger modal here too??

      if (!userEmail)
      {
        // console.log("ooink");
        return
      }

      // Generic message will do for now...
      var bodyMessage = "You have an update on your loan application.";
      var email = {
        id: loanID,
        to: userEmail,
        name: loan.name,
        message: bodyMessage,
      };

      Factory.sendEmail(email).then(
        function(response) {
          // this can be changed later to not trigger the alert
          //    and just do sucess messages like Assignments
          if (response.data.error) {
            console.log(response.data.error);
            alert("There was an error sending the email. Please check the logs");
          } else {
            alert("Notification email successfully sent to " + userEmail + "!");
          }
        },
        function(error) {
          console.log(error);
          alert("There was an error sending the email. Please check the logs");
      });
    };
  }
]);