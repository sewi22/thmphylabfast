    
    // DetailsPage
    $.mobile.document.on('pagebeforeshow', '#expDetailsPage', function(e){
        e.preventDefault();
        var expGroupNumber = localStorage.getItem("expGroupNumber");
        var expNumber = localStorage.getItem("expNumber");

        getExp(expGroupNumber, expNumber, function(result){
            var headline = result.expGroupNumber+"."+result.expNumber;
            $("#expDetailsHeadline").html(headline);
            $("#expDetailsContent").html(result.expName);
        });
    });
    
    
    $.mobile.document.on('pagecreate', '#expDetailsPage', function(e){
        e.preventDefault();
        addExpFooterNavbar(e.target.id);
        addExpPageContextMenuButton(e.target.id);
        fillExpDetailsContextMenu();
    });
    
    $.mobile.document.on('pagecreate', '#quizPage', function(e){
        e.preventDefault();
        addExpFooterNavbar(e.target.id);
        addExpPageContextMenuButton(e.target.id);        
    });
    
    // Create ExpLists (All and Fav)
    $.mobile.document.on('pagecreate', '.expListPage', function(e) {
        e.preventDefault();
        $(".ui-toolbar-back-btn").remove();
        $('.expList').delegate("li a", "touchend", function (){
            localStorage.setItem("expGroupNumber", $(this).jqmData('expgroupnumber'));
            localStorage.setItem("expNumber", $(this).jqmData('expnumber'));
        });
    });
    
    // Add Navbar Footer to expListAllPage
    $.mobile.document.on('pagecreate', '#expListAllPage', function(e) {
        e.preventDefault();
        addExpListFooterNavbar(e.target.id);
        addExpListContextMenuButton(e.target.id);
        fillExpListContextMenu();
    });
    
    // Add Navbar Footer to expListFavPage
    $.mobile.document.on('pagecreate', '#expListFavPage', function(e) {
        e.preventDefault();
        addExpListFooterNavbar(e.target.id);
        addExpListContextMenuButton(e.target.id);
        //addExpListContextMenu(e.target.id);
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
    });
    