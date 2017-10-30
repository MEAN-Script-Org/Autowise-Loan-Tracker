//uses classList, setAttribute, and querySelectorAll
//if you want this to work in IE8/9 youll need to polyfill these

angular.module('SWEApp').controller('AccordFuncController',
  ['$scope', '$location', 'Factory',
  function($scope, $location, Factory) {
      
      (function(){
            setTimeout(function(){ 

            var d = document,
            accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
            setAria,
            setAccordionAria,
            switchAccordion,
            touchSupported = ('ontouchstart' in window),
            pointerSupported = ('pointerdown' in window);

            var stateUpdate = -1;
            
          skipClickDelay = function(e){
            e.preventDefault();
            e.target.click();
          }

                setAriaAttr = function(el, ariaType, newProperty){
                el.setAttribute(ariaType, newProperty);
            };
            setAccordionAria = function(el1, el2, expanded){
                switch(expanded) {
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

        //function
          $scope.clickAccordion = function(loanID) {
            if(stateUpdate != -1)
            {
              $scope.$parent.updateCheckList(loanID, stateUpdate);
            }
          };
                
          switchAccordion = function(e) {
              console.log("triggered");
                e.preventDefault();

                var thisAnswer = e.target.parentNode.nextElementSibling;
                var thisQuestion = e.target;

                if(!(thisAnswer === null))
                {
                    if(thisAnswer.classList.contains('is-collapsed')) {
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
                }
                else if(thisQuestion.tagName.toLowerCase() === 'span')
                {
                    var input = e.target.previousElementSibling;
                    input.checked = !input.checked;
                    
                    stateUpdate = input.checked ? 1 : 0;
                }
            };

            for (var i=0,len=accordionToggles.length; i<len; i++) {
                if(touchSupported) {
              accordionToggles[i].addEventListener('touchstart', skipClickDelay, false);
            }
            if(pointerSupported){
              accordionToggles[i].addEventListener('pointerdown', skipClickDelay, false);
            }
            accordionToggles[i].addEventListener('click', switchAccordion, false);
            }



                ; }, 1000);

        })();
  }]);