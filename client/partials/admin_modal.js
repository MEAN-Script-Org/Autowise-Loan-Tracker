(function(window) {
    'use strict';
    
    $('#addInfoPanel').css('opacity', '0');
    
        $('.sb-search-submit').click(function(){
            $('#addInfoPanel').css('opacity', '1');
            $('#addInfoPanel').css('height', '100%');
        });
    
    
        $('#btn-chat').click(function(){
           $('#searchUserPanel').css('opacity', '0');
           $('#searchUserPanel').css('height', '0');
           $('#searchUserPanel').css('width', '0');
           $('#addInfoPanel').css('opacity', '1');
           $('#addInfoPanel').css('height', '100%');   
        });
    
    }
)();
