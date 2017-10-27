angular.module('SWEApp').controller('SearchController',
  ['$scope', '$location', 'Factory',
  function($scope, $location, Factory) {      
      
      (function(window) {

            'use strict';

            ////// FOR FILTER DISABLING //////
            var currentCheckCount = 0;
            $(":checkbox").each(function(index) {
                currentCheckCount = currentCheckCount + 1;
            });

            let totalCheckCount = currentCheckCount;
            currentCheckCount = 0;

            $('.disabler').addClass('disable');
            $(":checkbox").change(function(index) {
                let getId = this.id;
                
                if(this.checked)
                {currentCheckCount = currentCheckCount + 1;
                $('.sb-search').addClass('sb-search-open');
                $scope.$parent.searchScopes.push(getId);}
                else
                {currentCheckCount = currentCheckCount - 1;
                angular.forEach($scope.$parent.searchScopes, function(value, key) {
                    if(value === getId)
                    {
                        $scope.$parent.searchScopes.splice(key, 1);
                        return;
                    }
                });}

                if(currentCheckCount === 0)
                {$('.disabler').addClass('disable');
                $('.sb-search').removeClass('sb-search-open');}
                else
                {$('.disabler').removeClass('disable');}
            });
            ////// END FILTER DISABLING //////


        })();
  }]);