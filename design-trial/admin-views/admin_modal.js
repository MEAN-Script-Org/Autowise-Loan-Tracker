(function(window) {
    'use strict';
    $('#userP').css('opacity', '0');
    $('#userP').css('height', '0');
    $('#addInfoPanel').css('opacity', '0');
    
        $('.sb-search-submit').click(function(){
            $('#userP').css('opacity', '1');
            $('#userP').css('height', '100%');
        });
    
        $('#btn-chat2').click(function(){
           $('#userP').css('opacity', '0');
           $('#userP').css('height', '0');
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
