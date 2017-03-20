(function() {
    var name = document.getElementById("name");
    var year = document.getElementById("yearSelect");
    var course = document.getElementById("courseSelect");
    var optCourse = [];
    for (var i = 0; i < 4; i++) {
        optCourse[i] = document.getElementById("optCourse"+(i+1)+"Select");
    }
    
    // 必須項目チェック
    function checkValue() {
        if ( name.value && year.value && course.value ) {
            return true;
        }
        return false;
    }
    
    document.getElementById("registerForm").addEventListener("submit", function(e) {
        e.preventDefault(); // 送信中止
        
        if ( checkValue() ) { // 項目に不備なし
            var jsonVal = document.getElementById("jsonVal");
            // jsonに変換
            jsonVal.value = JSON.stringify({
                "enteredYear": year.value,
                "name": name.value,
                "course": course.value,
                "optionalCourse": function() {
                    var optVal = [];
                    for (var i = 0; i < optCourse.length; i++) {
                        optVal[i] = (optCourse[i].value) ? optCourse[i].value : null;
                    }
                    return optVal;
                }()
            });
            
            // 送信
            document.getElementById("jsonForm").submit();
            
        } else {
            alert( "必須項目を入力してください" );
        }

    }, false);
    
}());


(function () {
    // 入学年度の選択リスト
    var select1 = {
        "2013": "2013",
        "2014": "2014",
        "2015": "2015",
        "2016": "2016",
        "2017": "2017"
    };

    // 入学年度に対するコースリスト
    var select2 = {};
    select2[2013] = {
        "J": "J科",
        "I": "I科",
        "M": "M科",
        "S": "S科",
        "K": "K科"
    };
    select2[2014] = {
        "J": "J科",
        "I": "I科",
        "M": "M科",
        "S": "S科",
        "K": "K科"
    };
    select2[2015] = {
        "J": "J科",
        "I": "I科",
        "M": "M科",
        "S": "S科",
        "K": "K科"
    };
    select2[2016] = {
        "1": "1類",
        "2": "2類",
        "3": "3類",
        "KN": "K"
    };
    select2[2017] = {
        "1": "1類",
        "2": "2類",
        "3": "3類",
        "KN": "K"
    };
    
    // コースに対するoptionコースリスト(1年)
    var select3 = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7"
    };
    
    var select4 = {};
    select4["J"] = {
        "1": "1",
        "2": "2"
    };
    select4["I"] = {
        "1": "1",
        "2": "2",
        "3": "3"
    }
    select4["M"] = {
        "1": "1",
        "2": "2"
    };
    select4["S"] = {
        "1": "1",
        "2": "2",
        "3": "3"
    }
    
    // コースに対するoptionコースリスト(3年)
    var select5 = {};
    select5["J"] = {
            "メディア": "メディア",
            "セキュリティ": "セキュリティ",
            "経営": "経営"
    };
    select5["I"] = {
            "情報通信": "情報通信",
            "電子情報": "電子情報",
            "情報数理工学": "情報数理工学",
            "コンピュータサイエンス": "コンピュータサイエンス"
    };
    select5["M"] = {
        "先端ロボティクス": "先端ロボティクス",
        "機械システム": "機械システム",
        "電子制御": "電子制御",
        "電子工学": "電子工学"
    };
    select5["S"] = {
        "光エレクトロニクス": "光エレクトロニクス",
        "応用物理": "応用物理",
        "生体機能": "生体機能"
    };
    select5["K"] = {
        "先端工学基礎": "先端工学基礎"
    };
    

    var yearSel = document.getElementById("yearSelect");
    var courseSel = document.getElementById("courseSelect");
    var optCourse1 = document.getElementById("optCourse1Select");
    var optCourse2 = document.getElementById("optCourse2Select");
    var optCourse3 = document.getElementById("optCourse3Select");
    var optCourse4 = document.getElementById("optCourse4Select");
    
    // 入学年度の選択リストを作成
    createSelection( yearSel, select1);
    
    /**
     * optionの作成
     * @param object sel selectオブジェクト
     * @param object selOpt 選択肢
     */
    function createSelection(sel, selOpt) {
        if (sel.children.length > 1) { // 初期optionは除く
            // 子要素を全て削除
            var child;
            while(child = sel.lastChild) {
                sel.removeChild(child);
            }   
        }
        // optionの追加
        for(var i in selOpt) {
            var option = document.createElement("option");
            option.setAttribute("value", i);
            option.innerHTML = selOpt[i];
            sel.appendChild(option);
        }
    }
    
    // select1のChangeイベント
    yearSel.addEventListener("change", function(e) {
        createSelection(courseSel, select2[this.value]);
    }, false);
    
    // select2のChangeイベント
    courseSel.addEventListener("change", function(e) {
        createSelection(optCourse1, select3);
        createSelection(optCourse2, select4[this.value]);
        createSelection(optCourse3, select5[this.value]);
    }, false);
    
}());