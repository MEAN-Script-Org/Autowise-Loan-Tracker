// WARRANTIES MODULE ~
// Provides raw warranty plan data and functions for querying warranty plans based on user-inputted information
angular.module('SWEApp').controller('Warranties', ['$rootScope', '$scope', '$location',
  function($rootScope, $scope, $location) {
  
  // Tabulation of warranty plan prices according to car age, period of warranty plan, and mileage
  var warranties_table = [
    
    // Any year warranties
    {age: -1, type: 'Any Year', term : {months: 3,  miles: 3},  max_mileage: -1, price: 180},
    {age: -1, type: 'Any Year', term : {months: 6,  miles: 6},  max_mileage: -1, price: 390},
    {age: -1, type: 'Any Year', term : {months: 12, miles: 12}, max_mileage: -1, price: 1025},
    {age: -1, type: 'Any Year', term : {months: 24, miles: 24}, max_mileage: -1, price: 1350},
    {age: -1, type: 'Any Year', term : {months: 36, miles: 36}, max_mileage: -1, price: 1455},
    {age: -1, type: 'Any Year', term : {months: 48, miles: 48}, max_mileage: -1, price: -1},
    
    // Deluxe warranties (> 2007)
    {age: 2007, type: 'Deluxe', term : {months: 3,  miles: 3},  max_mileage: 150, price: 390},
    {age: 2007, type: 'Deluxe', term : {months: 3,  miles: 3},  max_mileage: 125, price: 335},
    {age: 2007, type: 'Deluxe', term : {months: 6,  miles: 6},  max_mileage: 150, price: 710},
    {age: 2007, type: 'Deluxe', term : {months: 6,  miles: 6},  max_mileage: 125, price: 640},
    {age: 2007, type: 'Deluxe', term : {months: 6,  miles: 6},  max_mileage: 100, price: 560},
    {age: 2007, type: 'Deluxe', term : {months: 12, miles: 12}, max_mileage: 150, price: 1415},
    {age: 2007, type: 'Deluxe', term : {months: 12, miles: 12}, max_mileage: 125, price: 1360},
    {age: 2007, type: 'Deluxe', term : {months: 12, miles: 12}, max_mileage: 100, price: 1285},
    {age: 2007, type: 'Deluxe', term : {months: 24, miles: 24}, max_mileage: 150, price: 1805},
    {age: 2007, type: 'Deluxe', term : {months: 24, miles: 24}, max_mileage: 125, price: 1755},
    {age: 2007, type: 'Deluxe', term : {months: 24, miles: 24}, max_mileage: 80,  price: 1665},
    {age: 2007, type: 'Deluxe', term : {months: 36, miles: 36}, max_mileage: 140, price: 2090},
    {age: 2007, type: 'Deluxe', term : {months: 36, miles: 36}, max_mileage: 125, price: 2030},
    {age: 2007, type: 'Deluxe', term : {months: 36, miles: 36}, max_mileage: 80,  price: 1915},
    {age: 2007, type: 'Deluxe', term : {months: 48, miles: 48}, max_mileage: 125, price: 2350},
    {age: 2007, type: 'Deluxe', term : {months: 48, miles: 48}, max_mileage: 80,  price: 2220},
    
    // Factory type warranties (> 2011)
    {age: 2011, type: 'Factory Type', term : {months: 3,   miles: 3},  max_mileage: 85, price: 440},
    {age: 2011, type: 'Factory Type', term : {months: 3,   miles: 3},  max_mileage: 65, price: 410},
    {age: 2011, type: 'Factory Type', term : {months: 6,   miles: 6},  max_mileage: 85, price: 695},
    {age: 2011, type: 'Factory Type', term : {months: 6,   miles: 6},  max_mileage: 65, price: 630},
    {age: 2011, type: 'Factory Type', term : {months: 12,  miles: 12}, max_mileage: 85, price: 1410},
    {age: 2011, type: 'Factory Type', term : {months: 12,  miles: 12}, max_mileage: 65, price: 1335},
    {age: 2011, type: 'Factory Type', term : {months: 24,  miles: 24}, max_mileage: 85, price: 1810},
    {age: 2011, type: 'Factory Type', term : {months: 24,  miles: 24}, max_mileage: 65, price: 1740},
    {age: 2011, type: 'Factory Type', term : {months: 36,  miles: 36}, max_mileage: 85, price: 2185},
    {age: 2011, type: 'Factory Type', term : {months: 36,  miles: 36}, max_mileage: 65, price: 2060},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 48}, max_mileage: 85, price: 2430},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 48}, max_mileage: 65, price: 2310},
    
    // Factory type warranties - Extensive use (> 2011, term >= 4 years or mileage >= 75,000)
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 120}, max_mileage: -1, price: {asian: 1970, domestic: 2300}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 120}, max_mileage: 40, price: {asian: 1840, domestic: 2070}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 120}, max_mileage: 15, price: {asian: 1720, domestic: 1960}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 100}, max_mileage: -1, price: {asian: 1865, domestic: 2100}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 100}, max_mileage: 40, price: {asian: 1760, domestic: 1940}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 100}, max_mileage: 15, price: {asian: 1650, domestic: 1850}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 75},  max_mileage: -1, price: {asian: 1795, domestic: 2050}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 75},  max_mileage: 40, price: {asian: 1695, domestic: 1855}},
    {age: 2011, type: 'Factory Type', term : {months: 48,  miles: 75},  max_mileage: 15, price: {asian: 1595, domestic: 1775}},
    
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 120}, max_mileage: -1, price: {asian: 2020, domestic: 2390}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 120}, max_mileage: 40, price: {asian: 1930, domestic: 2170}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 120}, max_mileage: 15, price: {asian: 1795, domestic: 2090}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 100}, max_mileage: -1, price: {asian: 1960, domestic: 2275}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 100}, max_mileage: 40, price: {asian: 1850, domestic: 2010}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 100}, max_mileage: 15, price: {asian: 1740, domestic: 1915}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 75},  max_mileage: -1, price: {asian: 1850, domestic: 2080}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 75},  max_mileage: 40, price: {asian: 1740, domestic: 1930}},
    {age: 2011, type: 'Factory Type', term : {months: 60,  miles: 75},  max_mileage: 15, price: {asian: 1635, domestic: 1840}},
    
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 120}, max_mileage: -1, price: {asian: 1910, domestic: 2475}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 120}, max_mileage: 40, price: {asian: 1800, domestic: 2230}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 120}, max_mileage: 15, price: {asian: 1690, domestic: 2150}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 100}, max_mileage: -1, price: {asian: 2020, domestic: 2350}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 100}, max_mileage: 40, price: {asian: 1900, domestic: 2090}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 100}, max_mileage: 15, price: {asian: 1795, domestic: 1990}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 75},  max_mileage: -1, price: {asian: 1880, domestic: 2140}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 75},  max_mileage: 40, price: {asian: 1770, domestic: 1990}},
    {age: 2011, type: 'Factory Type', term : {months: 72,  miles: 75},  max_mileage: 15, price: {asian: 1660, domestic: 1875}},
    
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 120}, max_mileage: -1, price: {asian: 2160, domestic: 2540}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 120}, max_mileage: 40, price: {asian: 2040, domestic: 2280}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 120}, max_mileage: 15, price: {asian: 1950, domestic: 2200}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 100}, max_mileage: -1, price: {asian: 2050, domestic: 2395}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 100}, max_mileage: 40, price: {asian: 1925, domestic: 2110}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 100}, max_mileage: 15, price: {asian: 1850, domestic: 2020}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 75},  max_mileage: -1, price: {asian: 1910, domestic: 2190}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 75},  max_mileage: 40, price: {asian: 1800, domestic: 2010}},
    {age: 2011, type: 'Factory Type', term : {months: 84,  miles: 75},  max_mileage: 15, price: {asian: 1690, domestic: 1895}},
    
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 120}, max_mileage: -1, price: {asian: 2195, domestic: 2590}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 120}, max_mileage: 40, price: {asian: 2090, domestic: 2340}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 120}, max_mileage: 15, price: {asian: 2000, domestic: 2270}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 100}, max_mileage: -1, price: {asian: 2050, domestic: 2420}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 100}, max_mileage: 40, price: {asian: 1945, domestic: 2140}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 100}, max_mileage: 15, price: {asian: 1835, domestic: 2075}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 75},  max_mileage: -1, price: {asian: 1925, domestic: 2250}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 75},  max_mileage: 40, price: {asian: 1830, domestic: 2035}},
    {age: 2011, type: 'Factory Type', term : {months: 96,  miles: 75},  max_mileage: 15, price: {asian: 1730, domestic: 1920}},
  ]
  
  /* WARRANTY QUERYING -
   A Query is pulled from the client side and matched against warranty plans in the warranty table
   The following steps determine the warranty plan that is returned
      
   1. Car minimum age equal to query minimum age
   2. Maximum mileage greater than query maximum mileage (-1 if no maximum)
   3. If applicable, select price based on the country of origin
  */
  
  //--------------------------------------------------------------------------------------------------------------------
  // Initialize the controller, declaraing the 'matchedWarranties' and 'query' objects
  //--------------------------------------------------------------------------------------------------------------------
  $scope.init = function() {
    $scope.matchedWarranties = warranties_table ;
    $scope.query = { age: '', max_mileage: 0, make: ''} ;
  }
  
  //--------------------------------------------------------------------------------------------------------------------
  // Called on submission of the warranties selection form. Checks the query against all possible warranties and assigns
  // Matching warranties to the 'matchedWarranties' object
  //--------------------------------------------------------------------------------------------------------------------
  $scope.queryWarrantyPlan = function() {
    console.log("Query age:         " + $scope.query.age) ;
    console.log("Query max milegae: " + $scope.query.max_mileage) ;
    console.log("Query make:        " + $scope.query.make) ;
    
    // Select possible warranties
    var warranties = warranties_table.filter(checkWarrantyAgainstQuery) ;
    
    console.log(warranties) ;
    
    // Refine 'price' field if a country of origin is requried
    warranties.forEach(function(warranty) {
      if (typeof warranty.price === 'object')
        warranty.price = warranty.price[$scope.query.make] ;
    });
    
    // Assign the compatible warranties to an object in the scope
    $scope.matchedWarranties = warranties ;
  }
  
  //--------------------------------------------------------------------------------------------------------------------
  // Filter function for warranty querying
  //--------------------------------------------------------------------------------------------------------------------
  function checkWarrantyAgainstQuery(warranty) {
      return  warranty.age.toString() === $scope.query.age ;           
  }
}]);