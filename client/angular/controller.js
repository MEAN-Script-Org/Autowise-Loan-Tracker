angular.module('SWEApp').controller('SWEAppController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    Factory.getUserInfo().then(function(response) {
      // Globals
      $rootScope.loans = [];
      $rootScope.reverse = true;
      $rootScope.reverse_comments = true;
      $rootScope.updatedLoan = {};

      $rootScope.user_id = response.data._id;
      // $rootScope.user_email = response.data.email;
      $rootScope.user_isAdmin = response.data.isAdmin;
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
          alert("Error deleting loan. Perhaps it was already deleted.");
          console.log(err);
        }
      );
    }

    $scope.addLoan = function() {
      // Assigning foreign elements
      $scope.newLoan.user_id = $rootScope.user_id;
      // $scope.newLoan.user_email = $rootScope.user_email;

      Factory.newLoan($scope.newLoan).then(
        function(response) {
          if (response.data) {
            $rootScope.loans.push(response.data);
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

    // Helper method for '$scope.addComment'
    function addCommentFrontend(loanID, newCommentContent) {
      var time_options = {
        minute: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        year: "numeric",
        hour12: true,
        timeZone: "America/New_York",
        timeZoneName: "short",
      };

      return $rootScope.loans.some(function(item, index, loans) {
        if (item._id) {
          if (item._id == loanID) {
            var newComment = {
              content: newCommentContent,
              admin: $rootScope.user_isAdmin,
              time: new Date().toLocaleString('en-US', time_options),
            }

            loans[index].comments.push(newComment);
            $rootScope.updatedLoan = loans[index];
            // if (loans[index].comments.push(newComment)) {}
            // console.log($rootScope.updatedLoan == loans[index]);

            return true;
          }
        }
      });
    }

    $scope.addComment = function(loanID) {
      /*
        Marcial, Style comment:
          The following uses jQuery, although
          it'll be better if it was in Angular style
            if anyone finds a way to do the "Angular way", change it
            JUST MAKE SURE to update the view logic as well
      */
      var wantedInputField = "#" + loanID + "-new-comment";
      var newCommentContent = $(wantedInputField).val();
      $(wantedInputField).val("");
      // saving text message content, clearing input field

      if (newCommentContent) {
        // update frontend
        if (addCommentFrontend(loanID, newCommentContent)) {
          // and DB
          Factory.modifyLoan(loanID, $rootScope.updatedLoan).then(
            function(res) {
              console.log("Returned new loan with updated comments:");
              console.log(res.data);
          });
        }
      }
    }

    $scope.emailClient = function(loanID, userEmail, clientName) {

      var errorMsg = "There was an error sending the email. Please check the logs";

      if (!userEmail) {
        alert("User has no email associated with their account");
        return
      }

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