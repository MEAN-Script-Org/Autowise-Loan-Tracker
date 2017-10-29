angular.module('SWEApp').controller('SWEAppController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    // TODO: Add progress effect like assigment 6 while we wait
    Factory.getUserInfo().then(function(response) {
      // Globals
      $rootScope.loans = [];
      $rootScope.updatedLoan = {};
      $rootScope.massLoans = [];
      $rootScope.searchScopes = [];
    
      $scope.commentAsAdmin = false;

      // ## Filter ~ !them for ascending order
      $rootScope.reverse = true;
      $rootScope.reverse_comments = true;

      // ## Login Details
      // $rootScope.pwd = "";
      // $rootScope.username = "";

      // TO Change based on routes~
      // ## User Details
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
            console.log($rootScope.loans);
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
    
    // TODO: add more state change f(x)s
    $scope.futureStateLoan = function(loanID, displayAlert) {
      $scope.changeLoanStatus(loanID, "future!", displayAlert);
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Removes a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeLoan = function(loanID, displayAlert) {
      // trigger modal.... THEN this
      // Delete should send things to archieve...
      //        Delete from DB, Add to 'archieve.json'
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
    
    //------------------------------------------------------------------------------------------------------------------
    // Updates the status of a single loan of the specified ID
    //------------------------------------------------------------------------------------------------------------------
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
      $scope.changeLoanStatus(loanID, "ARCHIVED", displayAlert);
    }
    // Function Below was already implemented in the wrapper method above
    // $scope.archiveLoan = function(loanID, displayAlert) {
    //   Factory.getLoan(loanID).then(function(res) {
    //       // Fetch selected loan and update its status
    //       var loan = res.data ;
    //       loan.archived = true ;
    //       // Send a request to save over the original loan
    //       Factory.modifyLoan(loanID, loan).then(function(res) {
    //         if (displayAlert)
    //           alert("Successfully archived loan");
    //       });
    //     },
    //     function(err) {
    //       alert("Error archiving loan");
    //       console.log(err);
    //     });
    // }
    
    //------------------------------------------------------------------------------------------------------------------
    // LOAN CRUD FUNCTIONS - EN MASSE
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    // Removal of all selected loans. Called from the modal dialog for mass loan deletion
    //------------------------------------------------------------------------------------------------------------------
    $scope.removeEnMass = function() {
      // this was the cause of the 'angular is not defined' prob
      // angular.forEach($rootScope.massLoans, function(loanID) {
      //   $scope.removeLoan(loanID, false) ;
      // });
      $rootScope.massLoans.forEach(
        function(loanID) {
          $scope.removeLoan(loanID, false) ;
      });
      
      alert("All selected loans have been deleted") ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Update to the specified status of all selected loans. Called from the modal dialog for mass loan update
    //------------------------------------------------------------------------------------------------------------------
    $scope.updateStatusEnMass = function(newStatus) {
      $rootScope.massLoans.forEach(
        function(loanID) {
          $scope.changeLoanStatus(loanID, newStatus, false)
      });
      
      alert("All selected loans have been updated to '" + newStatus + "'") ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Archive all selected loans. Called from the modal dialog for mass loan archive
    //------------------------------------------------------------------------------------------------------------------
    $scope.archiveEnMass = function() {
      $rootScope.massLoans.forEach(
        function(loanID) {
          $scope.archiveLoan(loanID, false) ;
      });
      
      alert("All selected loans have been archived") ;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // OTHER FUNCTIONS
    //------------------------------------------------------------------------------------------------------------------
    // MARK: CHECK LIST
    $scope.updateCheckList = function(loanID, remove) {
      if(remove) {
        $rootScope.massLoans.push(loanID);
        $rootScope.massLoans.forEach(
          function(loanID) {
            // This will log each loan id in 'massLoans'
            // But what's the point? 
            console.log("Loan selected: " + loanID);
        });
      } else {
        $rootScope.massLoans.forEach(
          function(value, index) {
            if (value === loanID) {
              $rootScope.massLoans.splice(key, 1);
            }
        });
      }
    }

    // TODO: Cleannnn this
    // MARK: Search
    $scope.search = function(loan) {
      // item.brand.toLowerCase().indexOf($scope.query) 
      var nameCheckbox = $rootScope.searchScopes.indexOf("nameCheckbox") === -1 ? false : true;
      var emailCheckbox = $rootScope.searchScopes.indexOf("emailCheckbox") === -1 ? false : true;
      var lenderCheckbox = $rootScope.searchScopes.indexOf("lenderCheckbox") === -1 ? false : true;
      var dateCheckbox = $rootScope.searchScopes.indexOf("dateCheckbox") === -1 ? false : true;

      console.log("N: " + nameCheckbox);
      console.log("E: " + emailCheckbox);
      console.log("L: " + lenderCheckbox);
      console.log("D: " + dateCheckbox);
      console.log(loan);
      // nameCheckbox && 
      console.log($scope.query);
      
      var nameMatch = loan.name.toLowerCase().includes($scope.query);
      // var emailMatch = loan.purchase_order.email.toLowerCase().includes($scope.query);
      // var lenderMatch = loan.purchase_order.car_info.lender.toLowerCase().includes($scope.query);
      // var dateMatch = loan.purchase_order.form_date.toLowerCase().includes($scope.query);
      
      return !$scope.query; 
      // if(!$scope.query)
      // {
      //     return true;
      // }
      // return false;
    };
    
    
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