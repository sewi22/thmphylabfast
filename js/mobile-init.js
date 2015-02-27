    
    $.mobile.document.on("mobileinit" , function(){
        //$.mobile.pageContainer = $('#container');
        $.mobile.toolbar.prototype.options.addBackBtn = true;
        //$.mobile.ignoreContentEnabled = true;
        $.mobile.buttonMarkup.hoverDelay = 0;
        $.mobile.defaultPageTransition   = 'none';
        $.mobile.defaultDialogTransition = 'none';
        //$.mobile.defaultPageTransition = 'slide';
    });