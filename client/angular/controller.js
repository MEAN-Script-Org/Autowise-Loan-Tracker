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

    $scope.logLoan = function(loanID) {
      $scope.changeLoanStatus(loanID, "ARCHIVED");
    }

    // TODO: add more state change f(x)s
    $scope.futureStateLoan = function(loanID) {
      $scope.changeLoanStatus(loanID, "future!");
    }

    // Main f(x) for changing state
    $scope.changeLoanStatus = function(loanID, status) {
      Factory.modifyLoan(loanID, {status: status}).then(
        function(response) {
          // update frontend after DB
          $rootScope.loans.some(function(item, index, loans) {
            if (item._id) {
              if (item._id == loanID) {
                loans[index].status = status;
                return true;
              }
            }
          });

          alert("Successfully archived loan");
        },
        function(err) {
          alert("Error archiving loan. Perhaps it was already archived.");
          console.log(err);
        }
      );
    }

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
    // Removal of all selected loans. Called from the modal dialog for mass loan deletion
    //------------------------------------------------------------------------------------------------------------------
    // TODO when cleaning: Change the implementation of this method to use the already created "removeLoan"
    //                      Just pass a boolean to not display "delete success" more than once
    $scope.removeEnMass = function() {
      
      console.log("Delete button clicked!") ;
      console.log("Loans deleted: " + $rootScope.massLoans) ;
      
      angular.forEach($rootScope.massLoans, function(loanID) {
        Factory.deleteLoan(loanID).then(
        function(response) {
          // update frontend after DB
          $rootScope.loans.some(function(item, index, loans) {
            if (item._id) {
              if (item._id == loanID) {
                $rootScope.massLoans.splice(index, 1) ; // Remove from the mass selection array
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
        });
      });
    }
    
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
    
    // MARK: CHECK LIST
    
    $scope.updateCheckList = function(loanID, remove) {
        if(remove == 1)
        {
            $rootScope.massLoans.push(loanID);
            angular.forEach($rootScope.massLoans, function(value) {
                console.log("val: " + value);
            });
        }
        else
        {
            angular.forEach($rootScope.massLoans, function(value, key) {
                if(value === loanID)
                {
                    $rootScope.massLoans.splice(key, 1);
                    return;
                }
            });
        }
    }

    // MARK: Search
    $scope.search = function(loan) {
//        item.brand.toLowerCase().indexOf($scope.query) 
        let nameCheckbox = $rootScope.searchScopes.indexOf("nameCheckbox") === -1 ? false : true;
        let emailCheckbox = $rootScope.searchScopes.indexOf("emailCheckbox") === -1 ? false : true;
        let lenderCheckbox = $rootScope.searchScopes.indexOf("lenderCheckbox") === -1 ? false : true;
        let dateCheckbox = $rootScope.searchScopes.indexOf("dateCheckbox") === -1 ? false : true;

        console.log("N: " + nameCheckbox);
        console.log("E: " + emailCheckbox);
        console.log("L: " + lenderCheckbox);
        console.log("D: " + dateCheckbox);
        console.log(loan);
        //            nameCheckbox && 
        console.log($scope.query);
        
        let nameMatch = loan.name.toLowerCase().includes($scope.query);
//        let emailMatch = loan.purchase_order.email.toLowerCase().includes($scope.query);
//        let lenderMatch = loan.purchase_order.car_info.lender.toLowerCase().includes($scope.query);
//        let dateMatch = loan.purchase_order.form_date.toLowerCase().includes($scope.query);
        
        if(!$scope.query)
        {
            return true;
        }
        return false;
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
            
            console.log(loans[index].commentAsAdmin);
            console.log(loans[index].commentAsAdmin);
            console.log(loans[index].commentAsAdmin);
            console.log(loans[index].commentAsAdmin);

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