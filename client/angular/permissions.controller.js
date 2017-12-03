angular.module('SWEApp').controller('Permissions', 
  ['$rootScope', '$scope', '$location', '$timeout', 'Factory',
  function($rootScope, $scope, $location, $timeout, Factory) {

    if (!Factory.getToken())
      window.location.href = "/profile/badtoken";
    
    $scope.visible = 'visible';
    $rootScope.users = [];
    $rootScope.loading = true;

    Factory.getUserInfo().then(
      function(res) {
        $rootScope.user = res.data;
    });

    Factory.getAllUsers().then(
      function(res) {
        $rootScope.users = res.data;

        // Formatting dates
        $rootScope.users.forEach(function(item, index, obj) {
          obj[index].dob = new Date(item.dob).toLocaleDateString('es-PA');
        });
      },
      function(err) {
        alert(err);
      });

    $scope.init = function() {
      $scope.query = [];
      $scope.isAdmin = true;
      $scope.visible = "visible";

      $timeout(function() {
          $rootScope.loading = false;
      }, 300);
    }
    
    
    // TODO: copy 'prepare' thing
    // only have a delete frontend thing
    // have a color coding for 'isAdmin'

    // $scope.removeUser = function(userID) {
    //   Factory.deleteUser(userID).then(
    //     function(response) {
    //       $rootScope.users.some(function(item, index, users) {
    //         if (item._id) {
    //           if (item._id == userID) {
    //             users.splice(index, 1);
    //             return true;
    //           }
    //         }
    //       });
    //     },
    //     function(err) {
    //       alert("There was a problem deleting this User.");
    //       console.log(err);
    //     }
    //   );
    // }


    // $scope.makeAdmin = function(userID, isAdmin) {
    //   Factory.makeAdmin(userID).then(
    //     function(response) {
    //       $rootScope.users.some(function(item, users) {
    //         if (item._id == userID) {
    //           users.isAdmin == true;
    //         }
    //       });
    //     },
    //     function(err) {
    //       alert("Error making user an admin.");
    //       console.log(err);
    //     });
    // }

    // $scope.makeUser = function(userID, isAdmin) {
    //   Factory.makeUser(userID).then(
    //     function(response) {
    //       $rootScope.users.some(function(item, users) {
    //         if (item._id == userID) {
    //           users.isAdmin = false;
    //         }
    //       });
    //     },
    //     function(err) {
    //       alert("Error updating to user.");
    //       console.log(err);
    //     });
    // }
  }
]);