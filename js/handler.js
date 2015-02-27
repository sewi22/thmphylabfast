    
    // Init on start of application. Starts DB and creates the ExpLists      
    $.mobile.document.ready(function() {        
        db = window.openDatabase("ThmPhyLabDb", "", "DB for THM-PhyLab App", 1024*1024);
        createDBTables();
        fillExpTables();
        fillQuestionTables();                    
    });
    
    
    $("#container").bind("pagecontainerchangefailed", function(e, ui) {
        e.preventDefault();
        $.mobile.loading('hide');
        alert("pagecontainerchangefailed");
        console.log(e);
        console.log(ui);
        return false; 
    });
    
    $("#container").bind("changefailed", function(e, ui) {
        e.preventDefault();
        $.mobile.loading('hide');
        alert("changefailed");
        console.log(e);
        console.log(ui);
        return false;
    });
    
    $("#container").bind("pagechangefailed", function(e, ui) {
        e.preventDefault();
        $.mobile.loading('hide');
        alert("pagechangefailed");
        console.log(e);
        console.log(ui);
        return false;
    });
    

    $(function () {
        $("[data-role=panel]").enhanceWithin().panel();
    });

    // Decision if going back in history or exiting app by clicking the "Back Button"
    $.mobile.document.on("click", "backbutton", function(e){
        e.preventDefault();
        if($.mobile.activePage.is('#expListPage')){      
            navigator.app.exitApp();
        } else {
            navigator.app.backHistory()
        }
        return false;
    });
    
    
    $.mobile.document.on("click", "#expListContextMenuButton", function(e) {      
        e.preventDefault();
        if( $(".ui-panel").hasClass("ui-panel-open") == true ){            
            $("#expListContextMenu").panel("close");
        }else{            
            $("#expListContextMenu").panel("open");            
        }
        return false;                
    });
    
    $.mobile.document.on("click", "#contextMenuBack", function(e) {                        
        e.preventDefault();
        if( $(".ui-panel").hasClass("ui-panel-open") == true ){
            $("#expListContextMenu").panel("close");
        }else{
            $("#expListContextMenu").panel("open");
        }
        return false;
    });          
    
    
    // Mark actual Exp as Favorite
    $.mobile.document.on("click", ".headerFavButton", function(e){                
        e.preventDefault();
        // Experimente als Favorit markieren und Button entsprechend darstellen (Theme)
        expGroupNumber = localStorage.getItem("expGroupNumber");
        expNumber = localStorage.getItem("expNumber");
        
        getExpIsFav(expGroupNumber, expNumber, function(result){            
            var expIsFav = (result.expIsFav == 0) ? 1 : 0;            
            setExpIsFav(expIsFav, expGroupNumber, expNumber, function(){});
            expIsFav = (expIsFav == 0) ? false : true;            
            //$(".headerFavButton").addClass('ui-state-focus');
            //$(".headerFavButton").addClass('ui-state-active');
            //$(".headerFavButton").addClass('ui-state-hover');
            
        });        
        return false;
    });

    // Open QR Code Reader and using callback values by scanning a QR Code Button
    //$.mobile.document.on('pagecreate', function(e) {
     //$(".headerQrButton").click( function(){
    $.mobile.document.on("click", ".headerQrButton", function(e){
        e.preventDefault();
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan( function (result) {
            alert("Scanner result: \n" +
            "text: " + result.text + "\n" +
            "format: " + result.format + "\n" +
            "cancelled: " + result.cancelled + "\n");
        },function (error) {
            console.log("Scanning failed: ", error);
        });
        return false;
    });
    

/*******************************************************************************************************************************************************/
    
               
    // DetailsPage
    $.mobile.document.on('pagebeforeshow', '#expDetailsPage', function(e){
        e.preventDefault();   
        var expGroupNumber = localStorage.getItem("expGroupNumber");
        var expNumber = localStorage.getItem("expNumber");
        
        getExp(expGroupNumber, expNumber, function(result){                        
            //var headline = result.expGroupNumber+"."+result.expNumber;            
            //$("#expDetailsHeadline").html(headline);
            $("#expDetailsContent").html(result.expName);
            //$(".footerQuizButton").attr("data-expGroupNumber", expGroupNumber);
            //$(".footerQuizButton").attr("data-expNumber", expNumber);
        });
        return false;    
    });
    
    $.mobile.document.on('pagecreate', '#expDetailsPage', function(e){
        e.preventDefault();        
        addExpFooterNavbar(e.target.id);
        return false;
    });

    $.mobile.document.on('pagecreate', '#quizPage', function(e){
        e.preventDefault();        
        addExpFooterNavbar(e.target.id);
        return false;
    });


    // LocalStoragePage
    // Show all Contents from LocalStorage on one Page for control
    // Also possibility to add a key:value pair and clear LocalStorage 
    $.mobile.document.on('pagecreate', '#localStoragePage', function(e){
        e.preventDefault();        
        var lscontent = "";
        lscontent += "Anzahl der Items: "+localStorage.length+"<br/>";
        for (var i=0; i<localStorage.length; i++){
            lscontent += localStorage.key(i)+" : "+localStorage.getItem(localStorage.key(i))+"<br/>";
        }
        $("#localStorageContent p").html(lscontent);

        $("#delLsButton").click( function(){
            localStorage.clear();
            $("#localStorageContent p").html("");
        });
        $("#addLsButton").click( function(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            localStorage.setItem("key"+text,"value"+text);
            $("#localStorageContent p").append(localStorage.key(localStorage.length-1)+ " : "+localStorage.getItem(localStorage.key(localStorage.length-1))+"<br/>");
        });
        return false;
    });
    
    
    // Swipe on detailsPage to Left
    $.mobile.document.on('swipeleft', '#expDetailsPage', function(e){
        e.preventDefault();        
        var next = '#' + $.mobile.activePage.next('[data-role=page]')[0].id;
        if(e.handled !== true){
            $(':mobile-pagecontainer').pagecontainer('change', next, {transition: 'slide', reverse: false});
            e.handled = true;
        }
        return false;
    });

    // Swipe on expListFavPage to Right
    $.mobile.document.on('swiperight', '#quizPage', function(e) {
        e.preventDefault();        
        var prev = '#' + $.mobile.activePage.prev('[data-role=page]')[0].id;                
        if(e.handled !== true){
            $(':mobile-pagecontainer').pagecontainer('change', prev, {transition: 'slide', reverse: true});
            e.handled = true;
        }
        return false;
    });
    
    // Click on Quiz Tab
    $.mobile.document.on('touchend', '#footerNavbarItemQuiz', function(e){
        e.preventDefault();
        if(!$(this).hasClass('ui-state-persist')){            
            $(':mobile-pagecontainer').pagecontainer('change', '#quizPage', {transition: 'slide', reverse: false});            
        }
        return false;
    });        

    
    // Click on Details Tab
    $.mobile.document.on('touchend', '#footerNavbarItemDetails', function(e){
        e.preventDefault();
        if(!$(this).hasClass('ui-state-persist')){
            $(':mobile-pagecontainer').pagecontainer('change', '#expDetailsPage', {transition: 'slide', reverse: true});
        }
        return false;
    });
        