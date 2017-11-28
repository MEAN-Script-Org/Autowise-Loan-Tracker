angular.module('SWEApp').controller('userPerm', ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

    $rootScope.users = {};

    Factory.getAllUsers().then(
      function(res) {
        //  buttons will modify 'isAdmin'
        $rootScope.users = res.data;
        $rootScope.users.forEach(function(item, index, obj) {
          obj[index].dob = new Date(item.dob).toLocaleDateString('en-IR');
        })
      },
      function(err) {
        alert(err);
    });

    $scope.init = function() {
      $scope.query = [];
      $scope.visible = "visible";
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