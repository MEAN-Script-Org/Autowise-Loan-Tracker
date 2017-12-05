angular.module('SWEApp').controller(
  'CustomerController', ['$rootScope', '$scope', '$location', '$window', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $window, $timeout, Factory) {

    if (!Factory.getToken())
      window.location.href = "/profile/badtoken";
    
    // GLOBALS
    $rootScope.loans = [];
    $rootScope.loading = true;

    Factory.getUserInfo().then(
      function(res) {
        $rootScope.user = res.data;
        
        if ($rootScope.user.isAdmin)
          window.location.href = "/profile/wrongUserType";
    });
    

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
      $window.location.href = '/profile/warranties/' + Factory.getToken() + '/' + loan_id ;
    }
    
    $scope.convert_warranties = function(type) {
      // 'any-year' are drivetrains...
      return type.toLowerCase().indexOf("any") > -1 ? "Drivetrain" : type;
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Adds a customer comment to the loan
    // Taken from "admin.controller.js"
    //------------------------------------------------------------------------------------------------------------------
    $scope.addComment = function(loanID) {
      var wantedInputField = ["#", loanID, "-new-comment"].join("");
      var newCommentContent = $(wantedInputField).val();
      
      $(wantedInputField).val("");
      console.log(newCommentContent);
      
      // saving text message content, clearing input field
      if (newCommentContent) {
        
        // update frontend...
        if (addCommentFrontend(loanID, newCommentContent)) {
          
          // ...and DB
          Factory.modifyLoan(loanID, $rootScope.loanWithNewComments).then(
            function(res) {
              console.log("Returned new loan with updated comments:");
              console.log(res.data);
            });
        }
      }
    }
    
    //------------------------------------------------------------------------------------------------------------------
    // Helper function that updates the frontend loan with the specified comment
    // Assumes a customer is submitting it
    // ALSO taken from "admin.controller.js"
    //------------------------------------------------------------------------------------------------------------------
    function addCommentFrontend(loanID, newCommentContent) {
      return $rootScope.loans.some(function(item, index, loans) {
        if (item._id) {
          if (item._id == loanID) {
            
            var newComment = {
              admin: false,
              writer: {
                id: $rootScope.user.id,
                name: $rootScope.user.name,
              },
              content: newCommentContent,
              newtime: new Date(),
            }
            
            loans[index].comments.push(newComment);
            $rootScope.loanWithNewComments = loans[index];
            return true;
          }
        }
      });
    }
    
    //--------------------------------------------------------------------------------------------------------------------
    // Removes the specified comment from the loan
    // ALSO TAKEN FROM "admin.controller.js" (eventually, maybe make this it's own controller...)
    //--------------------------------------------------------------------------------------------------------------------
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