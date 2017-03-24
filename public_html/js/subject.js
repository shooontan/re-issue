// 初期画面の形成
(function (){
    var url = "http://knium.net:3000/api/subject/getbycourse/?course=MI";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // 週6、7限までの授業オブジェクト
    function display(subjects) {
        // 各週
        for (var i = 0; i < weeks.length; i++) {
            // 各週の講義
            var dayOfSubs = subjects[weeks[i]];
            for( var j = 0; j < dayOfSubs.length; j++ ) {
                var period = document.getElementById("period"+(j+1));
                var td = document.createElement("td");
                var span = document.createElement("span");
                if (dayOfSubs[j]) { // 講義あり
                    var subName = dayOfSubs[j]["name"]; // 講義名
                    var subId = dayOfSubs[j]["_id"]; // 講義
                    // 科目追加
                    span.appendChild( document.createTextNode(subName) );
                    // 科目id追加
                    td.setAttribute("data-subid", subId);
                }
                td.appendChild(span);
                period.appendChild(td);
            }
        }
    }
    
    function getCookie(key) {
        var cookies = document.cookie;
        var cookieItem = cookies.split(";");
        for (i = 0; i < cookieItem.length; i++) {
            var elem = cookieItem[i].split("=");
            if (elem[0].trim() === key) {
                return unescape(elem[1]);
            } else {
                continue;
            }
        }
    }
    
    // デフォルト科目を取得する
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function () {
        if (xml.readyState === 4 && xml.status === 200) {
            // デフォルト科目一覧
            var defaultSub = JSON.parse(xml.responseText);
            
            // 土曜日追加(仮)
            defaultSub["Sat"] = [null,null,null,null,null,null,null];
            
            display(defaultSub);
        }
    };
    xml.open("GET", url, true);
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(null);
    
}());


// モーダルウィンドウ
(function () {
    var weeks = [
        ["Mon","月"], ["Tue","火"], ["Wed","水"],
        ["Thu","木"], ["Fri","金"], ["Sat", "土"]
    ];
    var table = document.getElementById("subjectTable");
    var modalWin = document.getElementById("modalWindow");
    var modalDay = document.getElementById("modalDay");
    var modalPer = document.getElementById("modalPeriod");
    var modalSub = document.getElementById("modalSub");
    var modalList = document.getElementById("modalList");
    var modalDelete = document.getElementById("deleteBtn");
    
    var urlBase = "http://knium.net:3000/api/subject/getByDayAndPeriod/?";
    // スクロール量
    var scrollY;
    
    // モーダルを開く
    function openModal() {
        modalWin.classList.add("active");
    }
    
    // モーダルを閉じる
    function closeModal() {
        // スクロール位置を戻す
        window.scrollTo(0, scrollY);
        // モーダルを隠す
        modalWin.classList.remove("active");
        // modalListの子要素を削除
        var child;
        while(child = modalList.lastChild) {
            modalList.removeChild(child);
        }
    }
    
    
    // モダルウィンドウに科目リストを表示する
    function display(list, tdEle) {
        var li = [];
        // 講義リストDOMを作成
        for(var i = 0; i < list.length; i++) {
            li[i] = document.createElement("li");
            var subName = document.createTextNode(list[i].name);
            li[i].textContent = list[i].name;
            li[i].setAttribute("data-subid", list[i]._id);
            modalList.appendChild(li[i]);
            
            // ついでにクリックイベントを。
            li[i].addEventListener("click", function(e) {
                // td要素のspanを削除
                var child;
                while(child = tdEle.lastChild) {
                    tdEle.removeChild(child);
                }
                
                var span = document.createElement("span");
                span.textContent = e.target.textContent;
                tdEle.appendChild(span);
                
                // テーブルtdにidと講義名を挿入!!!!
                tdEle.setAttribute(
                    "data-subid",
                    e.target.getAttribute("data-subid")
                );
                
                // モダル閉じる
                closeModal();
            }, false);
        }
    };
    
    
    
    // 時間割クリック
    table.addEventListener("click", function(e) {
        if ( e.target.tagName === "TD" ) {
            scrollY = window.pageYOffset; // スクロール量
            var tdPosi = getTdPosition(e.target);  // [0]:限 [1]:曜日
            
            // モダルタイトル
            modalDay.textContent = weeks[tdPosi[1]][1];
            modalPer.textContent = tdPosi[0]+1;
            
            var modalSubTxt = e.target.textContent;
            modalSub.textContent = (modalSubTxt) ? modalSubTxt : "なし";
            
            // パラメータセット(1-7, Won-Fri)
            var url = urlBase+"period="+(tdPosi[0]+1)+"&dayOfWeek="+weeks[tdPosi[1]][0];
            
            var xml = new XMLHttpRequest();
            xml.onreadystatechange = function() {
                if (xml.readyState === 4 && xml.status === 200) {
                    // m曜n限科目一覧
                    var subjectList = JSON.parse(xml.responseText);
                    display(subjectList, e.target);
                }
            }
            xml.open("GET", url, true);
            xml.setRequestHeader("Content-Type", "application/json" );
            xml.send(null);
            
            
            // モーダルウィンドウを開く
            openModal();
            
            
            // モーダル削除
            modalDelete.addEventListener("click", function() {
                e.target.textContent = "";
                e.target.removeAttribute("data-subid");
            }, false);
            
            
        }
    }, false);
    
    
    
    // モーダルウィンドウを閉じる
    document.addEventListener("click", function(e) {
        switch( e.target.id ) {
            case( "modalWindow" ):
            case( "closeBtn" ):
                closeModal();
                break;
        }
    }, false);
    
    
    // tdの位置を取得
    function getTdPosition(td) {
        return [td.parentNode.rowIndex-1, td.cellIndex]
    };
    
}());


// 時間割りデータの送信
(function() {
//    var user_id = "58d4aa501fc42b028154345b";
//    var user_name = "nersonu";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var tableData = {};
    for(var i = 0; i < weeks.length; i++) {
        tableData[weeks[i]] = [];
    }
    
    var tableForm = document.getElementById("tableForm");
    
    // cookeiからユーザidを取得
    var user_id = function(key) {
        var cookies = document.cookie;
        var cookieItem = cookies.split(";");
        for (i = 0; i < cookieItem.length; i++) {
            var elem = cookieItem[i].split("=");
            if (elem[0].trim() === key) {
                return unescape(elem[1]);
            } else {
                continue;
            }
        }
    }("user_id");
    
    console.log(user_id);
    
    
    tableForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        var table = document.getElementById("subjectTable");
        
        // 0行目はtheadなのでスキップ
        for(var i = 1; i < table.rows.length; i++) {
            for(var j = 0; j < table.rows[i].cells.length; j++) {
                var subText = table.rows[i].cells[j].innerText;
                
                if (subText) {
                    // 講義科目id取得
                    var subId = table.rows[i].cells[j].getAttribute("data-subid");
                    tableData[weeks[j]][i-1] = {
                        "_id": subId, "name": subText
                    };
                } else {
                    tableData[weeks[j]][i-1] = null;
                }
                
            }
        }
        
        console.log(tableData);
        
        
        // inputのvalueに値を入れる
        var value = JSON.stringify({
            "user_id": user_id,
            "taking": tableData
        });
        
        console.log(value);
        
        var url = "http://knium.net:3000/api/user/"+user_id;
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (xml.readyState === 4 && xml.status === 200) {
                var data = JSON.parse(xml.response);
                console.log(data);
                
                tableForm.submit();
            }
        }
        xml.open("POST", url);
        xml.setRequestHeader( "Content-Type", "application/json" );
        xml.send(value);
        
    }, false);
    
}());