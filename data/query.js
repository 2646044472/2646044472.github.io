// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyCVB3quR4-fjIFzwNc83DZfECYTBpXhO8E",
    authDomain: "utat-56b2e.firebaseapp.com",
    projectId: "utat-56b2e",
    storageBucket: "utat-56b2e.appspot.com",
    messagingSenderId: "559148636842",
    appId: "1:559148636842:web:7da66e4a8d8fe6debc0ed3",
    measurementId: "G-8DXJE6E2YL"
};

// 初始化
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (error) {
    alert("初始化失败：" + error.message);
}

// 时间格式化
function formatTime(timestamp) {
    const date = timestamp?.toDate?.();
    return date ? date.toLocaleString('zh-CN') : '时间无效';
}

// 加载数据
function setupDataLoader(role) {
    const list = document.getElementById(`${role}-data`);
    const counter = document.getElementById(`${role}-counter`);

    return db.collection(role)
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
            list.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${data.code || '未知'}</span>
                    <span>${formatTime(data.timestamp)}</span>
                `;
                list.appendChild(li);
            });
            counter.textContent = `(${snapshot.size}条)`;
            document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
        }, error => {
            console.error(error);
            list.innerHTML = `<li>加载失败：${error.message}</li>`;
        });
}

// 初始化加载
if (db) {
    const unsubs = [
        setupDataLoader('courier'),
        setupDataLoader('student')
    ];
    
    window.addEventListener('beforeunload', () => {
        unsubs.forEach(unsub => unsub());
    });
}