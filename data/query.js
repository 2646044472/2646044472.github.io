// 使用相同的 Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCVB3quR4-fjIFzwNc83DZfECYTBpXhO8E",
    authDomain: "utat-56b2e.firebaseapp.com",
    projectId: "utat-56b2e",
    storageBucket: "utat-56b2e.firebasestorage.app",
    messagingSenderId: "559148636842",
    appId: "1:559148636842:web:7da66e4a8d8fe6debc0ed3",
    measurementId: "G-8DXJE6E2YL"
};

// 初始化 Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase 初始化成功");
} catch (error) {
    console.error("Firebase 初始化失败:", error);
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    if (!db) {
        alert("数据库连接异常，请刷新页面重试");
        return;
    }

    // 实时监听学生数据
    db.collection("student")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            updateTable('student-data', querySnapshot);
        }, (error) => {
            console.error("学生数据监听失败:", error);
        });

    // 实时监听外卖员数据
    db.collection("courier")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            updateTable('courier-data', querySnapshot);
        }, (error) => {
            console.error("外卖员数据监听失败:", error);
        });

    // 更新表格的通用函数
    function updateTable(tableId, snapshot) {
        const tbody = document.getElementById(tableId);
        tbody.innerHTML = ''; // 清空现有内容

        snapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${data.code}</td>
                <td>${data.timestamp.toDate().toLocaleString()}</td>
            `;
            
            tbody.appendChild(row);
        });
    }
});