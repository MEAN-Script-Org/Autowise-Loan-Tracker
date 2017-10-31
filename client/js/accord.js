//uses classList, setAttribute, and querySelectorAll
//if you want this to work in IE8/9 youll need to polyfill these

// Wrapping original js content in angular controller
angular.module('SWEApp').controller('AccordFuncController', 
  ['$scope', '$location', 'Factory',
  function($scope, $location, Factory) {

    // MARK: Search
    // search function for specifying loan criteria
    $scope.search = function(loan) {
      
      // this retrieves the MAIN parent controller's scope of the application (crud.controller.js)
      let parentScope = $scope.$parent.$parent.$parent;

      //this returns a boolean value to see if the nameCheckbox (or any of the other attributes) has been selected in the parent's searchScopes variable
      //this allows us to verify which of the loan attributes we are searching for
      var nameCheckbox = parentScope.searchScopes.indexOf("nameCheckbox") === -1 ? false : true;
      var emailCheckbox = parentScope.searchScopes.indexOf("emailCheckbox") === -1 ? false : true;
      var lenderCheckbox = parentScope.searchScopes.indexOf("lenderCheckbox") === -1 ? false : true;
      var dateCheckbox = parentScope.searchScopes.indexOf("dateCheckbox") === -1 ? false : true;

      //find queried value in specified fields, this tests to see if we can match what is in the search box ($scope.query) and to a loan's selected attribute
      let queryVal = angular.lowercase($scope.query);
      var nameMatch = loan.name.toLowerCase().includes(queryVal);

      //the other fields can work once the loan object has the COMPLETE model information from the buyer order: email, lender info, form_date

      //        var emailMatch = loan.purchase_order.email.toLowerCase().includes(queryVal);
      //        var lenderMatch = loan.purchase_order.car_info.lender.toLowerCase().includes(queryVal);
      //        var dateMatch = loan.purchase_order.form_date.toLowerCase().includes(queryVal);

      //        || (emailCheckbox && emailMatch) || (lenderCheckbox && lenderMatch) || (dateCheckbox && dateMatch)

      //         console.log(nameMatch)// + " " + emailMatch + " " + lenderMatch + " " + dateMatch);
        
      //return true (true means return those individual loans that match) if there is nothing in the query (empty) or if there is a SELECTED match
      if (!$scope.query || (nameCheckbox && nameMatch)) {
        return true;
      }
      return false;
    };

    // IIFE Immediately Invokable Function Expression
    // calls function immediately when the javascript is rendered.
    (function() {
      // time out to handle delay while angular loads resources properly
      setTimeout(function() {

        var d = document,
          accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
          setAria,
          setAccordionAria,
          switchAccordion,
          touchSupported = ('ontouchstart' in window),
          pointerSupported = ('pointerdown' in window);

        // this handles state of updating, -1 for a state where the checkbox is not pressed, 1 for checked checkbox, 0 for unchecked checkbox
        var stateUpdate = -1;

        // reloads accordions for expandable functionality
        $scope.reloadAccordion = function() { 
          d = document,
          accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
          setAria,
          setAccordionAria,
          switchAccordion,
          touchSupported = ('ontouchstart' in window),
          pointerSupported = ('pointerdown' in window);
            
          for (var i = 0, len = accordionToggles.length; i < len; i++) {
              if (touchSupported) {
                accordionToggles[i].addEventListener('touchstart', skipClickDelay, false);
              }
              if (pointerSupported) {
                accordionToggles[i].addEventListener('pointerdown', skipClickDelay, false);
              }
              accordionToggles[i].addEventListener('click', switchAccordion, false);
            }
        };
        
        skipClickDelay = function(e) {
          e.preventDefault();
          e.target.click();
        }

        setAriaAttr = function(el, ariaType, newProperty) {
          el.setAttribute(ariaType, newProperty);
        };
        setAccordionAria = function(el1, el2, expanded) {
          switch (expanded) {
            case "true":
              setAriaAttr(el1, 'aria-expanded', 'true');
              setAriaAttr(el2, 'aria-hidden', 'false');
              break;
            case "false":
              setAriaAttr(el1, 'aria-expanded', 'false');
              setAriaAttr(el2, 'aria-hidden', 'true');
              break;
            default:
              break;
          }
        };

        // gets called when accordion is clicked, passes loanID to update checkList if stateUpdate holds that it has checked/or unchecked a checkbox
        $scope.clickAccordion = function(loanID) {
          if (stateUpdate != -1) {
            $scope.$parent.updateCheckList(loanID, stateUpdate);
          }
        };

          
        //function for if an accordion has been triggered, handles expansion and collapsing of accordion
        switchAccordion = function(e) {
          console.log("triggered");
          e.preventDefault();

          var thisAnswer = e.target.parentNode.nextElementSibling;
          var thisQuestion = e.target;

          if (!(thisAnswer === null)) {
            if (thisAnswer.classList.contains('is-collapsed')) {
              setAccordionAria(thisQuestion, thisAnswer, 'true');
            } else {
              setAccordionAria(thisQuestion, thisAnswer, 'false');
            }
            thisQuestion.classList.toggle('is-collapsed');
            thisQuestion.classList.toggle('is-expanded');
            thisAnswer.classList.toggle('is-collapsed');
            thisAnswer.classList.toggle('is-expanded');

            thisAnswer.classList.toggle('animateIn');

            stateUpdate = -1;
          } else if (thisQuestion.tagName.toLowerCase() === 'span') {
            var input = e.target.previousElementSibling;
            input.checked = !input.checked;

            stateUpdate = input.checked ? 1 : 0;
          }
        };

        //adds event listeners to each accordion item
        for (var i = 0, len = accordionToggles.length; i < len; i++) {
          if (touchSupported) {
            accordionToggles[i].addEventListener('touchstart', skipClickDelay, false);
          }
          if (pointerSupported) {
            accordionToggles[i].addEventListener('pointerdown', skipClickDelay, false);
          }
          accordionToggles[i].addEventListener('click', switchAccordion, false);
        }
      }, 1000);
    })();
  }
]);