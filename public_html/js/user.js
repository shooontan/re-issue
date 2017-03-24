(function() {
    var urlBase = "http://knium.net:3000/api/user/";
//    var user_id = "58d2794c7720383e9bf643b5";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    
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
    
    
    console.log(document.cookie);
    console.log(user_id);
    
    
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState === 4 && xml.status === 200) {
            // ユーザーの履修データ
            var data = JSON.parse(xml.responseText);
            display(data.taking);
        }
    }
    xml.open("GET", urlBase+user_id, true);
    xml.setRequestHeader( "Content-Type", "application/json" );
    xml.send(null);
    
    
    // 履修一覧の表示
    function display(subjects) {
        for( var i = 0; i < weeks.length; ++i ) {
            var ul = document.getElementById( weeks[i]+"Subject" );
            // 1日分の講義
            var daysStudy = subjects[weeks[i]];
            
            for( var j = 0; j < daysStudy.length; ++j ) {
                // 選択している講義と時間のみ表示
                if ( daysStudy[j] ) {
                    var span = document.createElement("span");
                    span.textContent = (j+1)+"限 "+daysStudy[j].name;
                    var li = document.createElement("li");
                    li.appendChild(span);
                    li.setAttribute("data-subid", daysStudy[j]._id);
                    ul.appendChild(li);
                    
                    // liにクリックイベント
                    li.addEventListener("click", function(e) {
                        console.log(e.target.getAttribute("data-subid"));
                        
                        var subCook = "sub_id="+e.target.getAttribute("data-subid");
                        
                        // cookieに科目idを保存
                        document.cookie = subCook;
                        
                        // リロード
                        location.reload();
                        
                    }, false);
                }
            }       
        }
    }
    
    // ユーザー名を表示
    var displayName = function(id) {
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (xml.readyState === 4 && xml.status === 200) {
                // ユーザーデータ
                var data = JSON.parse(xml.responseText);
                console.log(data.name);
                // 名前表示
                var displayName = document.getElementById("displayName");
                displayName.textContent = data.name;
            }
        }
        xml.open("GET", urlBase+user_id, true);
        xml.setRequestHeader( "Content-Type", "application/json" );
        xml.send(null);
    }(user_id);
    
}());


// メニュー
(function() {
    var nemuBtn = document.getElementById("menuBtn");
    var navi = document.getElementById("navi");
    
    nemuBtn.addEventListener("click", function(e) {
        this.classList.toggle("active");
        navi.classList.toggle("active");
        
    }, false);
    
}());


//タブ切り替え
(function() {
    var tabs = ["tabChat", "tabRepo", "tabUpload"];
    var target = [];
    
    for(var i = 0; i < tabs.length; i++) {
        target[i] = document.getElementById(tabs[i]);
        
        // クリックイベント
        target[i].addEventListener("click", function(e) {
            for(var j = 0; j < tabs.length; j++) {
                if (e.target.id === tabs[j]) {
                    target[j].classList.add("active");
                } else {
                    target[j].classList.remove("active");
                }
            }
        }, false);
    }
}());