(function (){
    var url = window.location.origin+"/api/taking";
    var user_id = "58b5179a82e96efabf76866f";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState === 4 && xml.status === 200) {
            // default時間割りデータ
            var data = JSON.parse(xml.responseText);
            display(data["taking"]);
        }
    }
    xml.onload = function() {
        //alert("complete"); //通信完了時
    }
    xml.open("GET", url, true);
    xml.send(null);
    
    function display(subjects) {
        // 各週
        for( var i = 0; i < weeks.length; ++i ) {
            var ul = document.getElementById( weeks[i]+"Subject" );
            
            // デフォルトの講義
            var defaultStudy = subjects[weeks[i]];
            for( var j = 0; j < defaultStudy.length; ++j ) {
                
                var period = document.getElementById("period"+(j+1));
                var td = document.createElement("td");
                
                if (defaultStudy[j]) { // 講義あり
                    td.innerHTML = "<span>"+defaultStudy[j]+"</span>";
                } else { // 講義なし
                    td.innerHTML = "<span></span>";
                }
                period.appendChild(td);   
            }
        }
    }
    
}());


// モーダルウィンドウ
(function () {
    var weeks = ["月", "火", "水", "木", "金", "土"];
    var table = document.getElementById("subjectTable");
    var modalWin = document.getElementById("modalWindow");
    
    // スクロール量
    var scrollY;
    
    // 時間割クリック
    table.addEventListener("click", function(e) {
        if ( e.target.tagName === "TD" ) {
            // スクロール量を取得
            scrollY = window.pageYOffset;
            
            // tdを取得
            var td = table.getElementsByTagName("td");
            var tdPosi = getTdPosition(e.target);
            
            document.getElementById("modalDay").innerHTML = weeks[tdPosi[1]];
            document.getElementById("modalPeriod").innerHTML = tdPosi[0] + 1;
            
            // モーダルウィンドウを開く
            modalWin.classList.add("active");   
        }
    }, false);
    
    
    // モーダルウィンドウを閉じる
    document.addEventListener("click", function(e) {
        switch( e.target.id ) {
            case( "modalWindow" ):
            case( "closeBtn" ):
                // スクロール位置を戻す
                window.scrollTo(0, scrollY);
                // モーダルを隠す
                modalWin.classList.remove("active");
                break;
        }

    }, false);
    
    
    // tdの位置を取得
    function getTdPosition(td) {
        return [td.parentNode.rowIndex-1, td.cellIndex]
    }
    
}());



// 時間割りデータの送信
(function() {
    var user_id = "58b5179a82e96efabf76866f";
    var user_name = "テスト太郎";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var tableData = {};
    for(var i = 0; i < weeks.length; i++) {
        tableData[weeks[i]] = [];
    }
    
    document.getElementById("tableForm").addEventListener("submit", function(e) {
//        e.preventDefault();
        
        var table = document.getElementById("subjectTable");
        
        // 0行目はtheadなのでスキップ
        for(var i = 1; i < table.rows.length; i++) {
            for(var j = 0; j < table.rows[i].cells.length; j++) {
                var subText = table.rows[i].cells[j].innerText;
                // 講義科目名を取得する
                tableData[weeks[j]][i-1] = (subText) ? subText : null;
            }
        }
        
        // inputのvalueに値を入れる
        document.getElementById("tableVal").value = JSON.stringify({
            "user_id": user_id,
            "name": user_name,
            "taking": tableData
        });

    }, false);
    
}());