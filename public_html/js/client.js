(function () {
    const init = (subjectId) => {
        const xhr = new XMLHttpRequest(); // eslint-disable-line
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const chatLog = JSON.parse(xhr.response);
                for (let i = 0; i < chatLog.length; i += 1) {
                    const messageList = document.querySelector('.messages'); // eslint-disable-line
                    const span = document.createElement('span');
                    span.setAttribute("class", "mess-date");
                    span.textContent = getPostTime(chatLog[i].created);
                    const p = document.createElement('p');
                    p.textContent = chatLog[i].text; // 本文
                    
                    var reg = /<script[^>]*?>/i.test(chatLog[i].text);
                    if (reg) {
                        p.setAttribute("class", "boo");
                    };
                    
                    p.appendChild(span);
                    const li = document.createElement('li'); // eslint-disable-line
                    li.appendChild(p);
                    messageList.appendChild(li);
                }
            }
        };
        xhr.open('GET', `http://knium.net:3000/api/chatlog/${subjectId}`, true);
        xhr.send();
    };
    const HOST = 'ws://knium.net:3000/api/chat/send';
    const ws = new WebSocket(HOST); // eslint-disable-line no-undef
    const room = { 0: '58d0dea52c0663e94d47e1a6', 1: '58d0dea52c0663e94d47e1a7' };
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
        
        const span = document.createElement('span');
        span.setAttribute("class", "mess-date");
        span.textContent = getPostTime();
        const p = document.createElement('p');
        p.textContent = response;
        
        var reg = /<script[^>]*?>/i.test(response);
        if (reg) {
            p.setAttribute("class", "boo");
        };
        
        p.appendChild(span);
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
        return date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
    }
    
}());

