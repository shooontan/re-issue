function reissueSocket(sub_id) {
    var subId = sub_id; // 科目id
    
    // cookie
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
    
    // cookeiからユーザ名を取得
    const userName = getCookie("user_name");
    const userId = getCookie("user_id");
    
    
    console.log("userName: "+userName);
    console.log("userId: "+userId);
    
    
    const init = (subId) => {
        const xhr = new XMLHttpRequest(); // eslint-disable-line
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const chatLog = JSON.parse(xhr.response);
                for (let i = 0; i < chatLog.length; i += 1) {
                    const messageList = document.querySelector('.messages'); // eslint-disable-line
                    
                    console.log(chatLog[i]);
                    
                    // ユーザー名span
                    const nSpan = document.createElement("span");
                    nSpan.classList.add("display-name");
                    nSpan.textContent = "by "+chatLog[i].speakerName;
                    
                    // 投稿日span
                    const dSpan = document.createElement('span');
                    dSpan.setAttribute("class", "mess-date");
                    dSpan.textContent = getPostTime(chatLog[i].created);
                    
                    
                    const p = document.createElement('p');
                    p.textContent = chatLog[i].text; // 本文
                    
                    var reg = /<script[^>]*?>/i.test(chatLog[i].text);
                    if (reg) {
                        p.setAttribute("class", "boo");
                    };
                    
                    p.appendChild(dSpan);
                    p.appendChild(nSpan);
                    const li = document.createElement('li'); // eslint-disable-line
                    li.appendChild(p);
                    messageList.appendChild(li);
                }
            }
        };
        xhr.open('GET', `http://knium.net:3000/api/chatlog/${subId}`, true);
        xhr.send();
    };
    const HOST = 'ws://knium.net:3000/api/chat/send';
    const ws = new WebSocket(HOST); // eslint-disable-line no-undef
    

    // 過去レポuploadのvalueセット
    const subjectDOM = document.getElementById("subjectId");
    subjectDOM.value = subId;
    console.log("subId:  "+subId);
    
    
    
    const form = document.querySelector('.form'); // eslint-disable-line
    init(subId);
    
    ws.onopen = () => { // 接続を確認してからルーム別用の識別子msgを送る．
        ws.send(`reIssueWSConnect://${subId}`);
    };
    form.onsubmit = () => {
        const input = document.querySelector('.input'); // eslint-disable-line
        if (input.value) { // 空文字の送信ができないように
            const text = `reIssueWSChat://${subId}/?text=${input.value}&speakerName=${userName}&speakerId=${userId}`;
            ws.send(text);
            input.value = '';
            input.focus();
        }
        return false;
    };

    ws.onerror = (error) => {
        console.log(`WebSocket Error ${error}`);
    };
    
    
    ws.onmessage = (msg) => {
        const response = msg.data;
        
        const resData = JSON.parse(response);
        
        const messageList = document.querySelector('.messages'); // eslint-disable-line
        
        // ユーザー名span
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("display-name");
        nameSpan.textContent = resData.speakerName;
        // 投稿日span
        const span = document.createElement('span');
        span.setAttribute("class", "mess-date");
        span.textContent = getPostTime();
        
        const p = document.createElement('p');
        p.textContent = resData.text;
        
        var reg = /<script[^>]*?>/i.test(response);
        if (reg) {
            p.setAttribute("class", "boo");
            alert("CTFじゃねーよはげ");
        };
        
        p.appendChild(span);
        p.appendChild(nameSpan);
        
        const li = document.createElement('li'); // eslint-disable-line
        li.appendChild(p);
        messageList.appendChild(li);
    };
    
    // 時間フォーマット統一
    function getPostTime(time) {
        var date = new Date();
        if ( time !== undefined ) {
            date = new Date(time);
        }
        return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
    

    // 科目名を表示
    var displayTitle = function() {
        var subUrl = "http://knium.net:3000/api/subject/";
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if (xml.readyState === 4 && xml.status === 200) {
                // ユーザーの履修データ
                var data = JSON.parse(xml.responseText);

                console.log(data);

                // 科目id
                const subjectName = data.name;
                console.log(subjectName);
                const title = document.getElementById('title');
                title.textContent = subjectName;
            }
        }
        xml.open("GET", subUrl+subId, true);
        xml.setRequestHeader( "Content-Type", "application/json" );
        xml.send(null);
    }();
    
};


(function() {
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
    
    var ajax = function() {
        var data;
        return new Promise(function(resolve, reject) {
            var urlBase = "http://knium.net:3000/api/subject/";
            var xml = new XMLHttpRequest();
            xml.onreadystatechange = function() {
                if (xml.readyState === 4 && xml.status === 200) {
                    var getData = JSON.parse(xml.responseText); 
                    console.log(getData.name);
//                    return subjectData.name;
                    this.data = getData.name;
                }
            }
            xml.open("GET", urlBase+subId, false);
            xml.setRequestHeader("Content-Type", "application/json" );
            xml.send(null);
            var subjectData = JSON.parse(xml.responseText);
            return subjectData.name;
        });
    };
    
    // cookieから科目idを取得
    var sub_id = getCookie("sub_id");
    if (sub_id) {
        // チャットチャット
        reissueSocket(sub_id);
    }
}());