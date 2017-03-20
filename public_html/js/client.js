(function () {
    const init = (subjectId) => {
        const xhr = new XMLHttpRequest(); // eslint-disable-line
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const chatLog = JSON.parse(xhr.response);
                for (let i = 0; i < chatLog.length; i += 1) {
                    const messageList = document.querySelector('.messages'); // eslint-disable-line
                    const li = document.createElement('li'); // eslint-disable-line
                    li.innerHTML = '<p>'+chatLog[i].text+'<span class="mess-date">'+getPostTime(chatLog[i].created)+'</sapn></p>';
                    messageList.appendChild(li);
                }
            }
        };
        xhr.onload = function() {
            //alert("complete"); //通信完了時
        }
        xhr.open('GET', window.location.origin+`/api/chatlog/${subjectId}`, true);
        xhr.send();
    };
    const HOST = 'ws://localhost:3000/api/chat/send';
    const ws = new WebSocket(HOST); // eslint-disable-line no-undef
    const room = { 0: '58b552de14d5f1260bed8574', 1: '58b5550314d5f1260bed8575' };
    const rand = Math.floor( Math.random() * 2); // eslint-disable-line
    const subject = { 0: '線形代数', 1: '微積分' };
    const title = document.getElementById('title'); // eslint-disable-line
    title.textContent = subject[rand];
    const form = document.querySelector('.form'); // eslint-disable-line
    console.log(room[rand]);
    init(room[rand]);
    
    ws.onopen = () => { // 接続を確認してからルーム別用の識別子msgを送る．
        ws.send(`reIssueWSConnect://${room[rand]}`);
    };
    form.onsubmit = () => {
        const input = document.querySelector('.input'); // eslint-disable-line
        if (input.value) { // 空文字の送信ができないように
            const text = `reIssueWSChat://${room[rand]}/?text=${input.value}&speaker=111111111111111111111111`;
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
        const messageList = document.querySelector('.messages'); // eslint-disable-line
        const li = document.createElement('li'); // eslint-disable-line
        li.innerHTML = '<p>'+response+'<span class="mess-date">'+getPostTime()+'</sapn></p>';
        messageList.appendChild(li);
    };
    
    // 時間フォーマット統一
    function getPostTime(time) {
        var date = new Date();
        if ( time !== undefined ) {
            date = new Date(time);
        }
        return date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
    }
    
}());
