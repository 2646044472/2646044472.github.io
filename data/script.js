// 🔥 Firebase 配置（保持与主站一致）
const firebaseConfig = {
    apiKey: "AIzaSyCVB3quR4-fjIFzwNc83DZfECYTBpXhO8E",
    authDomain: "utat-56b2e.firebaseapp.com",
    projectId: "utat-56b2e",
    storageBucket: "utat-56b2e.firebasestorage.app",
    messagingSenderId: "559148636842",
    appId: "1:559148636842:web:7da66e4a8d8fe6debc0ed3",
    measurementId: "G-8DXJE6E2YL"
};

// ✅ 安全初始化
let db;
try {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firestore connected");
} catch (error) {
    console.error("Firebase 初始化失败", error);
    document.body.innerHTML = `<div class="error">数据库连接失败，请检查网络</div>`;
}

// 🕒 时间格式化函数
function formatTime(timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 📊 数据加载函数（带错误处理）
function loadData(role) {
    const listElement = document.getElementById(`${role}-data`);
    const counterElement = document.getElementById(`${role}-counter`);
    
    listElement.innerHTML = '<li class="loading">加载中...</li>';
    
    db.collection(role)
        .orderBy("timestamp", "desc")
        .onSnapshot(
            snapshot => {
                listElement.innerHTML = '';
                if (snapshot.empty) {
                    listElement.innerHTML = '<li class="empty">暂无数据</li>';
                    counterElement.textContent = '0 条记录';
                    return;
                }

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="code">${data.code}</span>
                        <span class="time">${formatTime(data.timestamp)}</span>
                    `;
                    listElement.appendChild(listItem);
                });

                counterElement.textContent = `${snapshot.size} 条记录`;
            },
            error => {
                console.error(`${role}数据加载失败:`, error);
                listElement.innerHTML = `<li class="error">数据加载失败: ${error.message}</li>`;
            }
        );
}

// 🚀 初始化加载
if (db) {
    loadData("courier");
    loadData("student");
} else {
    document.querySelector('.container').innerHTML = `
        <div class="error-box">
            <h1>⚠️ 数据库连接异常</h1>
            <p>请检查网络连接后刷新页面</p>
        </div>
    `;
}