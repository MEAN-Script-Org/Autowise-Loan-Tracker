 angular.module('SWEApp').controller('SWEAppController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {
     
    Factory.getUserId().then(function(response) {
      $rootScope.user_id = response.data;
    });

    $scope.init = function() {
      console.log("Admin Page");

      // declared models
      $scope.state = "Processing";
      $scope.newLoan = {};

//      $rootScope.loans = [];
       $rootScope.loans = [
         {
           owner: "SHurtado", _id: "434234230", price: "3332",
           email: "shurtado91112@ufl.edu",
           comments: [
             "This is where the first admin comment would go.",
             "This is where the second ...",
             "This is where the third ...",
           ]
         },
         {
           owner: "MAbrahantes", _id: "434234235", price: "3333",
           email: "marcial1234@ufl.edu",
           comments: [
             "This is where the first admin comment would go.",
           ]
         },
         {
           owner: "Person with no email", _id: "pobre", price: "666",
           comments: [
             "[Insert comment here]",
           ]
         },
       ];
      
      Factory.getLoans().then(
        function(res) {
          if (res.data.length != 0){
            $rootScope.loans = res.data;
            console.log(res.data);
          }
          else {
            console.log("DB is empty ~");
          }
        }
      );
    }

    $scope.removeLoan = function(index, id) {
      Factory.deleteLoan(id).then(
        function(response) {
          $rootScope.loans.splice(index, 1);
          alert("Successfully deleted loan");
        },
        function(err) {
          alert("Error deleting loan. Perhaps it was already deleted.");
          console.log(err);
        }
      );
    }
    
    $scope.addLoan = function() {
      // Assigning foreign key
      $scope.newLoan.user_id = $rootScope.user_id;
    
      Factory.newLoan($scope.newLoan).then(
        function(response) {
          if (response.data) {
            $rootScope.loans.unshift(response.data);
            console.log("Returned new loan:");
            console.log(response.data);

            // clear once done
            $scope.newLoan = {};
          }
          else {
            $scope.newLoan = {};
            console.log("some weird shit happened");
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }

    $scope.addComment = function(index, loanID) {
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

      // console.log(wantedInputField);
      // console.log(newComment);

      // update frontend and DB
      $rootScope.loans[index].comments.push(newComment);
      Factory.newComment(loanID, newComment).then(
        function(res) {
          console.log("Returned new loan with updated comments:");
          console.log(res.data);
      });
    }
  }
]);

angular.module('SWEApp').controller('EmailTestController',
  ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    Factory.getUserId().then(function(response) {
      $rootScope.user_id = response.data;
    });

    $scope.init = function() {
      console.log("MEAN App on it's way!");

      // declared models
      $scope.state = "Processing";
      $scope.newLoan = {};

      $rootScope.loans = [];
      // $rootScope.loans = [
      //   {
      //     owner: "SHurtado", _id: "434234230", price: "3332",
      //     email: "shurtado91112@ufl.edu",
      //     comments: [
      //       "This is where the first admin comment would go.",
      //       "This is where the second ...",
      //       "This is where the third ...",
      //     ]
      //   },
      //   {
      //     owner: "MAbrahantes", _id: "434234235", price: "3333",
      //     email: "marcial1234@ufl.edu",
      //     comments: [
      //       "This is where the first admin comment would go.",
      //     ]
      //   },
      //   {
      //     owner: "Person with no email", _id: "pobre", price: "666",
      //     comments: [
      //       "[Insert comment here]",
      //     ]
      //   },
      // ];
      
      Factory.getLoans().then(
        function(res) {
          if (res.data.length != 0){
            $rootScope.loans = res.data;
            console.log(res.data);
          }
          else {
            console.log("DB is empty ~");
          }
        }
      );
    }

    $scope.removeLoan = function(index, id) {
      Factory.deleteLoan(id).then(
        function(response) {
          $rootScope.loans.splice(index, 1);
          alert("Successfully deleted loan");
        },
        function(err) {
          alert("Error deleting loan. Perhaps it was already deleted.");
          console.log(err);
        }
      );
    }

    $scope.addLoan = function() {
      // Assigning foreign key
      $scope.newLoan.user_id = $rootScope.user_id;
    
      Factory.newLoan($scope.newLoan).then(
        function(response) {
          if (response.data) {
            $rootScope.loans.unshift(response.data);
            console.log("Returned new loan:");
            console.log(response.data);

            // clear once done
            $scope.newLoan = {};
          }
          else {
            $scope.newLoan = {};
            console.log("some weird shit happened");
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }

    $scope.addComment = function(index, loanID) {
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

      // console.log(wantedInputField);
      // console.log(newComment);

      // update frontend and DB
      $rootScope.loans[index].comments.push(newComment);
      Factory.newComment(loanID, newComment).then(
        function(res) {
          console.log("Returned new loan with updated comments:");
          console.log(res.data);
      });
    }

    // logic to send email on change...
    $scope.email = function(isValid) {
      // $rootScope.updates = ...
      // Generic message will do for now...
      var bodyMessage = "You have a new update on your loan application";

      Factory.email(bodyMessage).then(
        function(response) {
          // this can be changed later to not trigger the alert
          // or just do sucess messages like before
          if (true) {
            alert("Update email successfully sent to " + "[Insert client name here]!");
          }
        },
        function(error) {
          console.log(error);
          alert("There was an error sending the email. Please check the logs.");
      });
    };
  }
]);