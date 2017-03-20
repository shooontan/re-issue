(function() {
    var url = window.location.origin+"/api/taking";
    var user_id = "58b5179a82e96efabf76866f";
    var weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState === 4 && xml.status === 200) {
            // ユーザーの履修データ
            var data = JSON.parse(xml.responseText);
            display(data.taking);
        }
    }
    xml.onload = function() {
        //alert("complete"); //通信完了時
    }
    xml.open("GET", url, true); // パラメータを(user_id)付けないといけない
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
                    var li = document.createElement("li");
                    li.setAttribute("data-period", j+1);
                    li.innerHTML = "<span>"+(j+1)+"限 "+daysStudy[j]+"</span>";
                    ul.appendChild(li);   
                }
            }
            
        }
    }
    
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