// Firebase 配置
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

    // 监听学生数据
    db.collection("student")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            updateTable('student-data', querySnapshot, "student");
        }, (error) => {
            console.error("学生数据监听失败:", error);
        });

    // 监听外卖员数据
    db.collection("courier")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            updateTable('courier-data', querySnapshot, "courier");
        }, (error) => {
            console.error("外卖员数据监听失败:", error);
        });

    // 更新表格
    function updateTable(tableId, snapshot, collection) {
        const tbody = document.getElementById(tableId);
        tbody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${data.code}</td>
                <td>${data.timestamp.toDate().toLocaleString()}</td>
                <td>
                    <button onclick="editRecord('${collection}', '${doc.id}', '${data.code}')">编辑</button>
                    <button onclick="deleteRecord('${collection}', '${doc.id}')">删除</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // 删除记录
    window.deleteRecord = function(collection, id) {
        if (confirm("确定要删除这条记录吗？")) {
            db.collection(collection).doc(id).delete()
                .then(() => {
                    console.log("记录删除成功");
                })
                .catch(error => {
                    console.error("删除失败:", error);
                });
        }
    };

    // 编辑记录
    window.editRecord = function(collection, id, currentCode) {
        const newCode = prompt("请输入新的编号:", currentCode);
        if (newCode && newCode !== currentCode) {
            db.collection(collection).doc(id).update({
                code: newCode
            })
            .then(() => {
                console.log("记录更新成功");
            })
            .catch(error => {
                console.error("更新失败:", error);
            });
        }
    };

    // 添加数据
    document.getElementById('add-data-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const role = document.getElementById('role').value;
        const code = document.getElementById('code').value;

        if (!code.trim()) {
            alert("编号不能为空");
            return;
        }

        db.collection(role).add({
            code: code,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("记录添加成功");
            document.getElementById('add-data-form').reset();
        })
        .catch(error => {
            console.error("添加失败:", error);
        });
    });
});