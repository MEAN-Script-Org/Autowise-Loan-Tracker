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
    $rootScope.loans = [];                // All loans in the database
    $rootScope.massLoans = [];            // All loans currently selected (checked)
    $rootScope.currLoan = {};             // Single loan of a current operation (creating, updating, etc.)
    $rootScope.loanWithNewComments = {};  // Loan with comments used to update the existing loan
    
    $rootScope.loading = true;
    $rootScope.searchScopes = [];
    
    $rootScope.isEditingLoan = false ;
    
    // Buyer's Order placeholder
    $rootScope.bo = {} ; 

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
    // LOAN CRUD FUNCTIONS - SINGLE
    //------------------------------------------------------------------------------------------------------------------
    
    //------------------------------------------------------------------------------------------------------------------
    // Sets the current buyer's order and loan to a blank template and sets the 'isEditingLoan' property to 'false'
    //------------------------------------------------------------------------------------------------------------------
    $scope.prepareLoanCreate = function() {
      
      // Assign empty templates to current loan and buyer's order objects
      $rootScope.currLoan = {} ;
      $rootScope.bo = { purchaser: {}, copurchaser: { invalid: "true" }, insr: {}} ;
      
      // Set editing flag to 'false'
      $rootScope.isEditingLoan = false ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Assigns the current buyer's order to that of the specified loan and sets the 'isEditingLoan' property to 'true'
    //------------------------------------------------------------------------------------------------------------------
    $scope.prepareLoanEdit = function(loan) {
      
      // Assign current loan and buyer's order objects
      $rootScope.currLoan = loan ;
      $rootScope.bo = loan.buyers_order ;
      
      // Set editing flag to 'true'
      $rootScope.isEditingLoan = true ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Called from the buyer's order modal
    // Information on the 'bo' and 'currLoan' objects are used to create a new loan in the database
    //------------------------------------------------------------------------------------------------------------------
    $scope.createLoanWithBO = function() {
      if (!$rootScope.currLoan) return ;
      
      var newLoan = $rootScope.currLoan ;
      
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
      
      // Create new loan and upload it to the database
      // On back-end, if a matching user exists with the purchaser information, the user is assigned this loan
      // Else the loan is dangling without an assigned user
      
      // TODO: test this!
      
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
    // Called from the buyer's order modal
    // Information on the 'bo' and 'currLoan' objects are used to update a loan in the database
    //------------------------------------------------------------------------------------------------------------------
    $scope.updateLoanWithBO = function() {
      if (!$rootScope.currLoan) return ;
      
      // Update loan in the database with updated buyer's order
      // On back-end, the loan may be reassigned to a user if the purchaser information has changed
      // Additionally, the loan may become dangling if there is no longer a user match
      
      // TODO: test this!
      
      Factory.modifyLoan($rootScope.currLoan._id, { buyers_order: $rootScope.bo }).then(
        function(res) {
          
          // TODO: Close modal
          //modal.hide
          //data-dismiss="modal"
          
          alert("Loan was updated successfully!") ;
        },
        function(err) {
          alert("Error updating loan! Ensure all fields are filled properly");
          console.log(err);
        }
      );
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Called from the admin warranty modal
    // Updates the loan with warranty information
    //------------------------------------------------------------------------------------------------------------------
    $scope.warrantyUpdate = function() {
      Factory.modifyLoan($rootScope.currLoan._id, $rootScope.currLoan).then(
        function(res) {
          
          // TODO: Close modal
          //modal.hide
          //data-dismiss="modal"
          
          alert("Warranty plan was updated successfully!") ;
        },
        function(err) {
          alert("Error updating warranty plan! Ensure field is filled properly");
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
    
    //------------------------------------------------------------------------------------------------------------------
    // Updates the status of a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
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

          $rootScope.currLoan = {} ;
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