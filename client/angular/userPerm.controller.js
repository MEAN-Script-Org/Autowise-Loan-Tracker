 angular.module('SWEApp').controller('userPerm', ['$rootScope', '$scope', '$location', 'Factory',
             function($rootScope, $scope, $location, Factory) {

                 $scope.init = function() {
                     $scope.visible = "visible";
                     $scope.query = "";
                 }

                 // BACKUP THESE TWO FILES, CHECKOUT 'merged-sprint-3'
                 // then 'git checkout -b [new_branch_name_here]'
                 // then actually implement stuff
                 // Flow:
                 // view => controller => Factory => user models
                 // view takes an id from ng-repeat, controller is an async call
                 // backend should be implemented, just add .delete in ("/users") in 
                 // routes.js


                 Factory.getAllUsers().then(
                     function(res) {
                         //  buttons will modify 'isAdmin'
                         $rootScope.fake_users = res.data;
                         console.log($rootScope.fake_users);
                     },
                     function(err) {
                         alert(err);
                     });


                 $scope.removeUser = function(userID) {
                     Factory.deleteUser(userID).then(
                         function(response) {
                             $rootScope.fake_users.some(function(item, index, fake_users) {
                                 if (item._id) {
                                     if (item._id == userID) {
                                         fake_users.splice(index, 1);
                                         return true;
                                     }
                                 }
                             });
                         },
                         function(err) {
                             alert("There was a problem deleting this User.");
                             console.log(err);
                         }
                     );
                 }

                 $scope.makeSuperAdmin = function(userID, superAdmin) {
                     Factory.makeSuperAdmin(userID).then(
                         function(response) {
                             $rootScope.fake_users.some(function(item, fake_users) {
                                 if (item._id == userID) {
                                     fake_users.superAdmin == true;
                                 }
                             });
                         },
                         function(err) {
                             alert("Error making user a super admin.");
                             console.log(err);
                         });
                     }

                     $scope.makeAdmin = function(userID, isAdmin) {
                         Factory.makeAdmin(userID).then(
                             function(response) {
                                 $rootScope.fake_users.some(function(item, fake_users) {
                                     if (item._id == userID) {
                                         fake_users.isAdmin == true;
                                     }
                                 });
                             },
                             function(err) {
                                 alert("Error making user an admin.");
                                 console.log(err);
                             });
                         }

                         $scope.makeUser = function(userID, isAdmin) {
                             Factory.makeUser(userID).then(
                                 function(response) {
                                     $rootScope.fake_users.some(function(item, fake_users) {
                                         if (item._id == userID) {
                                             fake_users.isAdmin = false;
                                         }
                                     });
                                 },
                                 function(err) {
                                     alert("Error updating to user.");
                                     console.log(err);
                                 });
                             }
                         }
                     ]);