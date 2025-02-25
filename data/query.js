// ✅ Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCVB3quR4-fjIFzwNc83DZfECYTBpXhO8E",
    authDomain: "utat-56b2e.firebaseapp.com",
    projectId: "utat-56b2e",
    storageBucket: "utat-56b2e.appspot.com",
    messagingSenderId: "559148636842",
    appId: "1:559148636842:web:7da66e4a8d8fe6debc0ed3",
    measurementId: "G-8DXJE6E2YL"
};

// ✅ 初始化 Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("✅ Firebase 初始化成功");
} catch (error) {
    console.error("❌ 初始化失败:", error);
    showGlobalError("数据库连接失败，请检查网络");
}

// ✅ 时间格式化函数
function formatTimestamp(timestamp) {
    if (!timestamp || !timestamp.toDate) {
        console.warn("⏰ 时间戳格式错误:", timestamp);
        return "未知时间";
    }
    return timestamp.toDate().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) + ' CST';
}

// ✅ 数据加载器
function setupRealtimeLoader(role) {
    const listElement = document.getElementById(`${role}-data`);
    const counterElement = document.getElementById(`${role}-counter`);
    
    if (!listElement || !counterElement) {
        console.error(`❌ 元素未找到: ${role}`);
        return;
    }

    // 初始状态
    listElement.innerHTML = '<div class="loading">加载中...</div>';
    
    return db.collection(role)
        .orderBy("timestamp", "desc")
        .onSnapshot(
            snapshot => {
                listElement.innerHTML = '';

                if (snapshot.empty) {
                    listElement.innerHTML = '<div class="empty">暂无数据</div>';
                    counterElement.textContent = '0 条记录';
                    return;
                }

                snapshot.forEach(doc => {
                    const data = doc.data();

                    if (!data.timestamp) {
                        console.warn(`⚠️ 文档 ${doc.id} 缺少 timestamp 字段`);
                        return; // 跳过无效数据
                    }

                    const listItem = document.createElement('li');
                    listItem.className = 'data-item';
                    listItem.innerHTML = `
                        <span class="code-badge">${data.code || "未知代码"}</span>
                        <span class="timestamp">${formatTimestamp(data.timestamp)}</span>
                    `;
                    listElement.appendChild(listItem);
                });

                counterElement.textContent = `${snapshot.size} 条记录`;
            },
            error => {
                console.error(`❌ ${role} 数据加载失败:`, error);
                listElement.innerHTML = `
                    <div class="error">
                        ${error.code === 'permission-denied' 
                            ? '⚠️ 访问被拒绝，请检查 Firestore 规则' 
                            : '数据加载失败，请刷新重试'}
                    </div>
                `;
                counterElement.textContent = '加载失败';
            }
        );
}

// ✅ 全局错误处理
function showGlobalError(message) {
    document.body.innerHTML = `
        <div class="error-container">
            <h2>⚠️ 系统错误</h2>
            <p>${message}</p>
            <button onclick="location.reload()">重试</button>
        </div>
    `;
}

// ✅ 初始化加载
if (db) {
    // 设置两个实时监听器
    const unsubscribeCourier = setupRealtimeLoader('courier');
    const unsubscribeStudent = setupRealtimeLoader('student');

    // 页面卸载时清理监听
    window.addEventListener('beforeunload', () => {
        unsubscribeCourier && unsubscribeCourier();
        unsubscribeStudent && unsubscribeStudent();
    });
}