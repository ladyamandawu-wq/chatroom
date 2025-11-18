const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const imageBtn = document.getElementById("image-btn");
const imageUpload = document.getElementById("image-upload");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");

let userId = localStorage.getItem("chatUserId");
if(!userId){
    userId = "user_"+Math.random().toString(36).slice(2);
    localStorage.setItem("chatUserId", userId);
}

let chatData = [];

// 顯示訊息
function addMessage(text, from, isImage=false){
    const div = document.createElement("div");
    div.className = `msg ${from===userId?"me":"other"}`;
    if(isImage){
        const img = document.createElement("img");
        img.src = text;
        img.style.maxWidth="200px";
        img.style.borderRadius="8px";
        div.appendChild(img);
    } else {
        div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    chatData.push({text, from, isImage});
}

// 發送訊息
sendBtn.onclick = () => {
    const msg = input.value.trim();
    if(!msg) return;
    addMessage(msg, userId);
    input.value = "";
};

// Ctrl+Enter 發送
input.addEventListener("keydown", e => {
    if(e.key==="Enter" && e.ctrlKey){
        sendBtn.onclick();
    }
});

// 上傳圖片
imageBtn.onclick = ()=> imageUpload.click();
imageUpload.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=> addMessage(reader.result, userId, true);
    reader.readAsDataURL(file);
};

// 匯出聊天紀錄
exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(chatData)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.json";
    a.click();
};

// 匯入聊天紀錄
importBtn.onclick = ()=> importFile.click();
importFile.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=> {
        try{
            chatData = JSON.parse(reader.result);
            messages.innerHTML = "";
            chatData.forEach(m => addMessage(m.text, m.from, m.isImage));
        }catch{
            alert("匯入失敗，檔案格式錯誤");
        }
    };
    reader.readAsText(file);
};
