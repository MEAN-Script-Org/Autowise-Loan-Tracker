angular.module('SWEApp').controller(
  'CRUDController', ['$rootScope', '$scope', '$location', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $timeout, Factory) {

    // $rootScope.loans = [
    //    {"name" : "Steven", "_id" : 1}, 
    //    {"name" : "Marcial", "_id" : 2}, 
    //    {"name" : "Max", "_id" : 3}
    // ];
    // GLOBALS
    // Essentially, anything that goes into an async (Factory) call
    $rootScope.loans = [];
    $rootScope.loading = true;
    $rootScope.massLoans = [];
    $rootScope.searchScopes = [];
    $rootScope.singleLoanID = [];
    $rootScope.loanWithNewComments = {};
    $rootScope.isEditingLoan = false ;
    
    // Buyer's Order placeholder
    $rootScope.bo = { purchaser: {}, copurchaser: { invalid: true }, insr: {}} ; 

    $scope.init = function() {
      console.log("MEAN App on it's way!");

      $scope.commentAsAdmin = false;
      
      // ## Order Filters ~ !them for ascending order
      // not doing much with this rn...
      $scope.reverse = true;
      $scope.reverse_comments = true;

      $scope.newLoan = {};
      $scope.isAdmin = true;
      $scope.visible = "visible";

      Factory.getLoans().then(
        function(res) {
          if (res.data.length != 0) {
            $rootScope.loans = res.data;
            console.log($rootScope.loans);
          } else {
            console.log("DB is empty ~");
          }

          $timeout(function() {
            $rootScope.loading = false;
          }, 1000);
        }
      );
    }

    $scope.logout = function() {
      Factory.logout();
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Assigns the current buyer's order to that of the specified loan and sets the 'isEditingLoan' property to 'true',
    // altering the beahvior of the buyer's order modal dialog
    //------------------------------------------------------------------------------------------------------------------
    $scope.editLoanWithBO = function(loan) {
      $rootScope.singleLoanID.push(loan._id) ;
      $rootScope.bo = loan.buyers_order ;
      
      console.log(loan) ;
      
      $rootScope.isEditingLoan = true ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Called from the buyer's order modal. Updates the currently selected loan in the database
    //------------------------------------------------------------------------------------------------------------------
    $scope.updateLoanWithBO = function() {
      if ($rootScope.singleLoanID.length < 1)
        return ;
      
      // Update loan in the database with updated buyer's order
      Factory.modifyLoan($rootScope.singleLoanID[0], { buyers_order: $rootScope.bo }).then(
        function(res) {
          
          // On success, clear the fields and set 'isEditingLoan' to 'false'
          isEditingLoan = false ;
          $rootScope.bo = { purchaser: {}, copurchaser: { invalid: true }, insr: {}} ;
          $rootScope.singleLoanID = [] ;
        },
        function(err) {
          alert("Error updating loan! Ensure all fields are filled properly");
          console.log(err);
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
            var newLoan = response.data;
            newLoan.new = true;
            $rootScope.loans.push(newLoan);

            // Logging
            // console.log("Returned new loan: ");
            // console.log(response.data);

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
    // Create a new loan with all the fields specified under the Buyer's Order
    //------------------------------------------------------------------------------------------------------------------
    $scope.addLoanWithBO = function() {
      var newLoan = $scope.newLoan ;
      
      newLoan.buyers_order = $rootScope.bo ;                  // Assign buyer's order information to loan
      newLoan.name = newLoan.buyers_order.purchaser.name ;    // Copy Purchaser name to Loan name field
      
      // Checks if insurance has been specifeid
      // If not, asks the User if they would like to continue
      var insurance = newLoan.buyers_order.insr ;
      if (!(insurance.company && insurance.policy_no)) {
        var confirmation = confirm("Insurance company and/or policy number has not been specified. Submit this Loan anyway?") ;
        
        if (!confirmation)
          return ;
      }
      
      // TODO: search for existing user via 'newLoan.buyers_order.purchaser' specifications
      //       if none found, prompt to add a new user
      
      // Use factory to create new loan and upload it to the database
      Factory.newLoan(newLoan).then(
        function(response) {
          if (response.data) {
            
            // Making the loan
            newLoan = response.data ;
            newLoan.new = true ;
            
            // Add loan to front-end scope
            $rootScope.loans.push(newLoan) ;
            
            // clear form data once done
            $scope.newLoan = {} ;
            $rootScope.bo = { purchaser: {}, copurchaser: { invalid: "true" }, insr: {}} ;
            
            // TODO: Close modal
            //modal.hide
            //data-dismiss="modal"
            
            alert("Loan was created successfully!") ;
          }
        },
        function(err) {
          alert("There was an error submitting the form. Ensure all required fields are filled") ;
          
          console.log(err);
        }
      );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Removes a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeLoan = function(loanID, uncofirmedDeletion) {
      // TODO Sprint 3:
      // Delete should send things to archieve...
      //        Delete from active DB, Add to 'archieve.json' in server
      if (uncofirmedDeletion) {
        if (confirm("Are you sure you want to delete this loan? Doing so will delete ALL records of it"))
          $scope.removeLoan(loanID, true);
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

            // if (displayAlert)
            //   alert("Successfully deleted loan");
          },
          function(err) {
            alert("Error deleting loan. Perhaps it was already deleted");
            console.log(err);
          }
        );
      }
    }

    // Marcial:
    //    AVOID angular.ANYTHING for general javascript/programming actions

    //------------------------------------------------------------------------------------------------------------------
    // Updates the status of a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    // TODO LATER: Could improve efficiency if needed if passing an object with loanIDs,
    //             then iterate for attributes
    $scope.changeLoanStatus = function(loanID, newStatus) {
      Factory.modifyLoan(loanID, { status: newStatus }).then(
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

          if ($rootScope.singleLoanID.length > 0)
            $rootScope.singleLoanID = [];
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
    $scope.archiveLoan = function(loanID) {
      if (confirm("You sure you want to archive this loan?")) {
        $scope.changeLoanStatus(loanID, "Archived");
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    // LOAN CRUD FUNCTIONS - EN MASSE
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    // Removal of all selected loans. Called from the modal dialog for mass loan deletion
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeEnMass = function() {
      if (confirm("You sure you want to remove these " + $rootScope.massLoans.length + " loans?")) {
        $rootScope.massLoans.forEach(
          function(loanID) {
            $scope.removeLoan(loanID, false);
          });
        $rootScope.massLoans = [];

        alert("All selected loans have been deleted");
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Update to the specified status of all selected loans. Called from the modal dialog for mass loan update
    //------------------------------------------------------------------------------------------------------------------
    $scope.updateStatusEnMass = function(newStatus) {
      if (newStatus) {
        $rootScope.massLoans.forEach(
          function(loanID) {
            $scope.changeLoanStatus(loanID, newStatus)
            $scope.clearCheckbox(loanID);
          });

        // Clearing var once done
        $rootScope.massLoans = [];
        alert("All selected loans have been '" + newStatus + "'");
      } else {
        alert("Nothing was changed");
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    // OTHER FUNCTIONS
    //------------------------------------------------------------------------------------------------------------------
    // MARK: CHECK LIST
    $rootScope.updateCheckList = function(loanID, add) {
      if (add) {
        $rootScope.massLoans.push(loanID);
      } else {
        $rootScope.massLoans.forEach(
          function(value, index, loans) {
            if (value === loanID) {
              loans.splice(index, 1);
            }
          });
      }
    }

    $scope.checkTrigger = function(loanID) {
      let stateUpdate = $("#" + loanID + "-checkbox")[0].checked;
      if (stateUpdate != -1) {
        $scope.updateCheckList(loanID, stateUpdate);
      }
    };

    $scope.clearMassLoans = function() {
        $rootScope.massLoans = [];
    }

    // TODO LATER: Same comment as 'changeLoanStatus' ~
    // Clearing frontend checkboxes
    $scope.clearCheckbox = function(loanID) {
      // jQuery again
      var checkbox = ["#", loanID, "-checkbox"].join("");
      $(checkbox).prop('checked', false);;
    }

    function addCommentFrontend(loanID, newCommentContent) {
      // JS time int to string options... but chose to go with Angular
      // DO NOT DELETE THESE COMMENTS
      // var time_options = {
      //     minute: "numeric",
      //     month: "short",
      //     day: "numeric",
      //     hour: "numeric",
      //     year: "numeric",
      //     hour12: true,
      //     timeZone: "America/New_York",
      //     timeZoneName: "short",
      // };
      // check 'https://docs.angularjs.org/api/ng/filter/date' for future changes using angular

      return $rootScope.loans.some(function(item, index, loans) {
        if (item._id) {
          if (item._id == loanID) {

            var newComment = {
              admin: loans[index].commentAsAdmin,
              writer: {
                id   : $rootScope.id,
                name : $rootScope.user_name,
              },
              content: newCommentContent,
              newtime: new Date(),
              // time: new Date().toLocaleString('en-US', time_options),
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
      console.log(newCommentContent);
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

    // TODO: Clear or figure out why I wrote the 'if (item.id)'s...
    $scope.removeComment = function(loanID, comments, nonwanted) {
      comments.some(function(item, index, array) {
        if (nonwanted.content == item.content && nonwanted.newtime == item.newtime) {
          array.splice(index, 1);
          return true;
        }
      });

      // update DB after Frontend
      Factory.modifyLoan(loanID, { comments: comments }).then(
        function(response) {
          return;
        },
        function(err) {
          alert("Error deleting comment");
          console.log(err);
        }
      );
    }

    $scope.emailClient = function(loanID, userEmail, clientName) {

      if (!userEmail) {
        alert("Customer has no email associated with their account");
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