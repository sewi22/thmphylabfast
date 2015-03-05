    var db;
    function createDBTables() {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ExpGroups (id INTEGER PRIMARY KEY AUTOINCREMENT, expGroupNumber INTEGER NOT NULL, expGroupName TEXT NOT NULL)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Experiments (id INTEGER PRIMARY KEY AUTOINCREMENT, expNumber INTEGER NOT NULL, expName TEXT NOT NULL, expGroupNumber INTEGER NOT NULL, expIsActive INTEGER NOT NULL, expIsFav INTEGER NOT NULL)');

            tx.executeSql('CREATE TABLE IF NOT EXISTS ExpQuestions (id INTEGER PRIMARY KEY AUTOINCREMENT, expGroupNumber INTEGER NOT NULL, expNumber INTEGER NOT NULL, question TEXT NOT NULL, questionType TEXT NOT NULL, givenAnswerId TEXT, givenAnswerText TEXT, givenAnswerNumber REAL)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS ExpAnswers (id INTEGER PRIMARY KEY AUTOINCREMENT, questionId INTEGER NOT NULL, answer TEXT, answerNumber REAL, plus REAL, minus REAL, answerIsCorrect INTEGER, helpText TEXT)');
        });
    }
    function errorCB(err){
        console.log("Folgender DB Fehler ist aufgetreten: "+err.code);
        alert("Error: "+err.code);
    }
    function fillExpTables(){
        $.ajax({
            url: "http://winterling.net/thmphylab/data/exp.php",
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                q: "experiments",
                format: "json"
            },
            success: function(result) {
                db.transaction(function(tx){
                    for(var i=0;i<result.experiments.length;i++){
                        (function(i){
                            var expGroup = result.experiments[i];
                            tx.executeSql("SELECT * FROM ExpGroups WHERE expGroupNumber = ? AND expGroupName = ?", [expGroup.expGroupNumber, expGroup.expGroupName], function(tx, res) {
                                if(res.rows.length==0){
                                    tx.executeSql("INSERT INTO ExpGroups (expGroupNumber, expGroupName) VALUES (?,?)", [expGroup.expGroupNumber, expGroup.expGroupName], function(tx, res) {
                                    }, errorCB);
                                }
                            }, errorCB);
                            for(var e=0;e<expGroup.experiments.length;e++){
                                (function(e){
                                    var exp = expGroup.experiments[e];
                                    tx.executeSql("SELECT * FROM Experiments WHERE expNumber = ? AND expName = ?", [exp.expNumber, exp.expName], function(tx, res) {
                                        if(res.rows.length==0){
                                            var active = (exp.active == true) ? 1 : 0;
                                            tx.executeSql("INSERT INTO Experiments (expGroupNumber, expNumber, expName, expIsActive, expIsFav) VALUES (?,?,?,?,?)", [expGroup.expGroupNumber, exp.expNumber, exp.expName, active, 0], function(tx, res) {
                                            }, errorCB);
                                        }
                                    }, errorCB);
                                })(e);
                            }
                        })(i);
                    }
                });
                createExpListAll();                
            },
            error: function(err){
                console.log('Fehler beim Laden der Versuchsdaten: '+err.code);
                alert('Fehler beim Laden der Versuchsdaten: '+err.code);
            }
        });
    }
    function fillQuestionTables(){
        $.ajax({
            url: "http://winterling.net/thmphylab/data/quiz.php",
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                q: "quiz",
                format: "json"
            },
            success: function(result) {
                db.transaction(function(tx){
                for(var e=0;e<result.quiz.length;e++){
                    (function(e){
                    var exp = result.quiz[e];
                    for(var f=0;f<exp.questions.length;f++){
                        (function(f){
                        var q = exp.questions[f];
                        tx.executeSql("SELECT * FROM ExpQuestions WHERE question = ? AND expGroupNumber = ? AND expNumber = ?", [q.question, exp.expGroupNumber, exp.expNumber], function(tx, res) {
                            if(res.rows.length==0){
                                tx.executeSql("INSERT INTO ExpQuestions (expGroupNumber, expNumber, question, questionType) VALUES (?,?,?,?)", [exp.expGroupNumber, exp.expNumber, q.question, q.questionType], function(tx, res) {
                                    var lastInsertId = res.insertId;
                                    for(var g=0;g<q.answers.length;g++){
                                        (function(g){
                                            var a = q.answers[g];
                                            if(q.questionType == 'mc'){
                                                var correct = (a.correct == true) ? 1 : 0;
                                                if(typeof a.helpText == 'undefined') {var helpText = ""} else {var helpText = a.helpText}
                                                tx.executeSql("INSERT INTO ExpAnswers (questionId, answer, answerIsCorrect, helpText) VALUES (?,?,?,?)", [lastInsertId, a.answer, correct, helpText], function(tx, res) {
                                                }, errorCB);
                                            } else if (q.questionType == 'text'){
                                                if(typeof a.helpText == 'undefined') {var helpText = ""} else {var helpText = a.helpText}
                                                tx.executeSql("INSERT INTO ExpAnswers (questionId, answer, answerIsCorrect, helpText) VALUES (?,?,?,?)", [lastInsertId, a, 1, helpText], function(tx, res) {
                                                }, errorCB);
                                            } else if (q.questionType == 'number'){
                                                if(typeof a.helpText == 'undefined') {var helpText = ""} else {var helpText = a.helpText}
                                                if(typeof q.plus == 'undefined') {var plus = 0} else {var plus = q.plus}
                                                if(typeof q.minus == 'undefined') {var minus = 0} else {var minus = q.minus}
                                                tx.executeSql("INSERT INTO ExpAnswers (questionId, answerNumber, plus, minus, answerIsCorrect, helpText) VALUES (?,?,?,?,?,?)", [lastInsertId, a, plus, minus, 1, helpText], function(tx, res) {
                                                }, errorCB);
                                            }
                                        })(g);
                                    }
                                }, errorCB);
                            }
                        }, errorCB);
                        })(f);
                    }
                    })(e);
                }
                });
            },
            error: function(err){
                console.log('Fehler beim Laden der Quizdaten: '+err.code);
                alert('Fehler beim Laden der Quizdaten: '+err.code);
            }
        });
    }