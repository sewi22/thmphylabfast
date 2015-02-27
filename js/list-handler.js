
    // Create ExpLists (All and Fav)
    $.mobile.document.on('pagecreate', '.expListPage', function(e) {        
        e.preventDefault();
        $(".ui-toolbar-back-btn").remove();
        $('.expList').delegate("li a", "click", function (){
            localStorage.setItem("expGroupNumber", $(this).jqmData('expgroupnumber'));
            localStorage.setItem("expNumber", $(this).jqmData('expnumber'));
        });      
        return false;
    });
    
    // Add Navbar Header to expListAllPage
    $.mobile.document.on('pagecreate', '#expListAllPage', function(e) {              
        e.preventDefault();
        addExpListHeaderNavbar(e.target.id);
        addExpListContextMenu(e.target.id);
        fillExpListContextMenu();
        return false;         
    });
    
    // Add Navbar Header to expListFavPage
    $.mobile.document.on('pagecreate', '#expListFavPage', function(e) {        
        e.preventDefault();
        addExpListHeaderNavbar(e.target.id);
        addExpListContextMenu(e.target.id);
        return false;
    });

    
    // Swipe on expListAllPage to Left
    $.mobile.document.on('swipeleft', '#expListAllPage', function(e) {
        e.preventDefault();
        console.log($.mobile.activePage.next('[data-role=page]'));        
        var next = '#' + $.mobile.activePage.next('[data-role=page]')[0].id;
        if(e.handled !== true){
            $(':mobile-pagecontainer').pagecontainer('change', next, {transition: 'slide', reverse: false});
            e.handled = true;
        }
        return false;        
    });
    
    // Click on Fav Tab
    $.mobile.document.on('touchend', '#expListNavbarItemFav', function(e){        
        e.preventDefault();
        if(!$(this).hasClass('ui-state-persist')){
            $(':mobile-pagecontainer').pagecontainer('change', '#expListFavPage', {transition: 'slide', reverse: false});
        }
        return false;
    });

    
    // Swipe on expListFavPage to Right
    $.mobile.document.on('swiperight', '#expListFavPage', function(e) {        
        e.preventDefault();
        var prev = '#' + $.mobile.activePage.prev('[data-role=page]')[0].id;
        if(e.handled !== true){
            $(':mobile-pagecontainer').pagecontainer('change', prev, {transition: 'slide', reverse: true});
            e.handled = true;
        }
        return false;
    });

    // Click on All Tab
    $.mobile.document.on('touchend', '#expListNavbarItemAll', function(e){        
        e.preventDefault();
        if(!$(this).hasClass('ui-state-persist')){
            $(':mobile-pagecontainer').pagecontainer('change', '#expListAllPage', {transition: 'slide', reverse: true});
        }
        return false;
    });
    
    
    /*
    $.mobile.document.on('pagecreate', '#expListAllPage', function(e) {
        //console.log("onPageCreate #expListAllPage");
    });

    $.mobile.document.on('pagecreate', '#expListFavPage', function(e) {
        //console.log("onPageCreate #expListFavPage");
    });

    $.mobile.document.on('pagebeforeshow', '#expListAllPage', function(e) {
        //console.log("onPageShow #expListAllPage");
    });

    $.mobile.document.on('pagebeforeshow', '#expListFavPage', function(e) {
        //console.log("onPageShow #expListFavPage");
    });
    */