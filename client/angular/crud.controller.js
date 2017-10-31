angular.module('SWEApp').controller('CRUDController',
  ['$rootScope', '$scope', '$location', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $timeout, Factory) {

    // Globals
    // Essentially, anything that goes into an async (Factory) call
    $rootScope.loans = [];
    $rootScope.loading = true;
    $rootScope.massLoans = [];
    $rootScope.searchScopes = [];
    $rootScope.loanWithNewComments = {};

    // $rootScope.toggle_input = function() {
    //   $(".sb-search-input").toggleClass("sb-search-open");
    //   console.log("dalee");
    // }
    
    Factory.getUserInfo().then(function(response) {
      $scope.commentAsAdmin = false;

      // ## Order Filters ~ !them for ascending order
      $scope.reverse = true;
      $scope.reverse_comments = true;

      // TO Change based on routes~
      // ## User Details
      $rootScope.user_id = response.data._id;
      // $rootScope.user_email = response.data.email;
      $rootScope.user_isAdmin = response.data.isAdmin;
    });
    
    $scope.init = function() {
      console.log("MEAN App on it's way!");

      $scope.newLoan = {};

      Factory.getLoans().then(
        function(res) {
          if (res.data.length != 0){
            $rootScope.loans = res.data;
            console.log($rootScope.loans);

            $timeout(function() {
              $rootScope.loading = false;
            }, 3000);
          }
          else {
            console.log("DB is empty ~");
          }
        }
      );
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // LOAN CRUD FUNCTIONS - SINGLE
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    // Create a new loan, prompting the buyer's order modal dialog
    //------------------------------------------------------------------------------------------------------------------
    $scope.addLoan = function() {
      // Assigning foreign elements
      $scope.newLoan.user_id = $rootScope.user_id;
      // $scope.newLoan.user_email = $rootScope.user_email;

      Factory.newLoan($scope.newLoan).then(
        function(response) {
          if (response.data) {
            // Making the loan
            var newLoad = response.data;
            newLoad.new = true;
            $rootScope.loans.push(newLoad);

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
    
    //------------------------------------------------------------------------------------------------------------------
    // Removes a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeLoan = function(loanID, displayAlert, sureDeletion) {
      // TODO Sprint 3:
      // Delete should send things to archieve...
      //        Delete from active DB, Add to 'archieve.json' in server
      if (!sureDeletion)
      {
        if (confirm("You sure you want to delete this loan?"))
          $scope.removeLoan(loanID, displayAlert, true);
      } else {
        Factory.deleteLoan(loanID).then(
          function(response) {
            // update frontend after DB
            $rootScope.loans.some(function(item, index, loans) {
              if (item._id) {
                if (item._id == loanID) {
                  loans.splice(index, 1);
                  return true;
                }
              }
            });

            if (displayAlert)
              alert("Successfully deleted loan");
          },
          function(err) {
            alert("Error deleting loan. Perhaps it was already deleted.");
            console.log(err);
          }
        );
      }
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Updates the status of a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    // TODO LATER: Could improve efficiency if needed if passing an object with loanIDs, 
    //             then iterate for attributes
    $scope.changeLoanStatus = function(loanID, newStatus, displayAlert) {
      Factory.modifyLoan(loanID, {status: newStatus}).then(
        function(response) {
          // update frontend after DB
          $rootScope.loans.some(function(item, index, loans) {
            if (item._id) {
              if (item._id == loanID) {
                loans[index].status = newStatus;
                return true;
              }
            }
          });
          
          if (displayAlert)
            alert("Successfully updated loan to status '" + newStatus + "'");
        },
        function(err) {
          alert("Error updating loan status");
          console.log(err);
        }
      );
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Archives the loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    $scope.archiveLoan = function(loanID, displayAlert) {
      if (confirm("You sure you want to archive this loan?"))
      {
        $scope.changeLoanStatus(loanID, "Archived", displayAlert);
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    // LOAN CRUD FUNCTIONS - EN MASSE
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    // Removal of all selected loans. Called from the modal dialog for mass loan deletion
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeEnMass = function() {
      if (confirm("You sure you want to remove these " + $rootScope.massLoans.length + " loans?"))
      {
        $rootScope.massLoans.forEach(
          function(loanID) {
            $scope.removeLoan(loanID, false, true) ;
        });
        $rootScope.massLoans = [];
        
        alert("All selected loans have been deleted") ;
      }
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Update to the specified status of all selected loans. Called from the modal dialog for mass loan update
    //------------------------------------------------------------------------------------------------------------------
    $scope.updateStatusEnMass = function(newStatus) {
      if (newStatus) {
        $rootScope.massLoans.forEach(
          function(loanID) {
            $scope.changeLoanStatus(loanID, newStatus, false)          
            $scope.clearCheckbox(loanID);
        });
        
        // Clearing var once done
        $rootScope.massLoans = [];
        alert("All selected loans have been '" + newStatus + "'") ;
      } else {
        alert("Nothing was changed")
      }
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // OTHER FUNCTIONS
    //------------------------------------------------------------------------------------------------------------------
    // MARK: CHECK LIST
    // Marcial: This is being called by the accordion controller on checkbox selection
    $scope.updateCheckList = function(loanID, remove) {
      if (remove) {
        $rootScope.massLoans.push(loanID);
        $rootScope.massLoans.forEach(
          function(loanID) {
            // This will log each loan id in 'massLoans'
            // But what's the point? 
            console.log("Loan selected: " + loanID);
        });
      } else {
        $rootScope.massLoans.forEach(
          function(value, index, loans) {
            if (value === loanID) {
              loans.splice(index, 1);
            }
        });
      }
    }
    
    // TODO LATER: Same comment as 'changeLoanStatus' ~
    // Clearing frontend checkboxes
    $scope.clearCheckbox = function(loanID) {
      // jQuery again
      var checkbox = ["#", loanID, "-checkbox"].join("");
      $(checkbox).prop('checked', false);;
    }

    // Helper method for '$scope.addComment'
    function addCommentFrontend(loanID, newCommentContent) {
      // check 'https://docs.angularjs.org/api/ng/filter/date' for future changes using angular
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
              admin: loans[index].commentAsAdmin,
              content: newCommentContent,
              // time: new Date().toLocaleString('en-US', time_options),
              newtime: new Date(),
            }

            loans[index].comments.push(newComment);
            $rootScope.loanWithNewComments = loans[index];
            return true;
          }
        }
      });
    }

    $scope.addComment = function(loanID) {
      /*
        The following uses jQuery
        No suitable Angular way found
      */
      var wantedInputField = ["#", loanID, "-new-comment"].join("");
      var newCommentContent = $(wantedInputField).val();
      $(wantedInputField).val("");
      // saving text message content, clearing input field

      if (newCommentContent) {
        // update frontend
        if (addCommentFrontend(loanID, newCommentContent)) {
          // and DB
          Factory.modifyLoan(loanID, $rootScope.loanWithNewComments).then(
            function(res) {
              console.log("Returned new loan with updated comments:");
              console.log(res.data);
          });
        }
      }
    }

    $scope.emailClient = function(loanID, userEmail, clientName) {

      if (!userEmail) {
        alert("User has no email associated with their account");
        return ;
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