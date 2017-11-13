 angular.module('SWEApp').controller('userPerm', ['$rootScope', '$scope', '$location', 'Factory',
     function($rootScope, $scope, $location, Factory) {

         $scope.init = function() {
             $scope.visible = "visible";
             $scope.query = "";
             $scope.fake_users = [
                 { username: "Harrison", dob: 1 },
                 { username: "Marcial", dob: 2 },
                 { username: "Steven", dob: 3 },
                 { username: "Max", dob: 4 },
                 { username: "Michael", dob: 5 },
                 { username: "lalala", dob: 6 },
             ];
         }

         // make fake f(x)s here
         //here
         /*$scope.removeUser = function(username) {
             $scope.removeUser(username, true);

             function(err) {
                 alert("Error deleting loan. Perhaps it was already deleted");
                 console.log(err);
             }
         }

         $scope.makeSuperAdmin = function(username) {
             $scope.makeSuperAdmin(username, true);

             function(err) {
                 alert("Error making user a super admin.");
                 console.log(err);
             }
         }

         $scope.makeAdmin = function(username) {
             $scope.makeAdmin(username, true);

             function(err) {
                 alert("Error making user a admin.");
                 console.log(err);
             }
         }

         $scope.makeUser = function(username) {
             $scope.makeUser(username, true);

             function(err) {
                 alert("Error updating to user.");
                 console.log(err);
             }
         }*/
     }

 ]);