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
        if(this.checked)
        {currentCheckCount = currentCheckCount + 1;
        $('.sb-search').addClass('sb-search-open');}
        else
        {currentCheckCount = currentCheckCount - 1;}
        
        if(currentCheckCount === 0)
        {$('.disabler').addClass('disable');
        $('.sb-search').removeClass('sb-search-open');}
        else
        {$('.disabler').removeClass('disable');}
    });
    ////// END FILTER DISABLING //////
    
    
})();