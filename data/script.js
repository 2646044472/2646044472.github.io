// Firebase 配置
const firebaseConfig = {
    apiKey: "你的API密钥",
    authDomain: "你的项目ID.firebaseapp.com",
    projectId: "你的项目ID",
    storageBucket: "你的项目ID.appspot.com",
    messagingSenderId: "你的Sender ID",
    appId: "你的App ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function loadData(role) {
    const listElement = document.getElementById(role + '-data');
    listElement.innerHTML = '';

    db.collection(role).orderBy("timestamp", "desc").onSnapshot(snapshot => {
        listElement.innerHTML = ''; // 清空旧数据
        snapshot.forEach(doc => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `编号: ${data.code} - 时间: ${data.timestamp.toDate().toLocaleString()}`;

            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.onclick = () => deleteCode(role, doc.id);

            // 修改按钮
            const editButton = document.createElement('button');
            editButton.textContent = '修改';
            editButton.onclick = () => editCode(role, doc.id, data.code);

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            listElement.appendChild(listItem);
        });
    });
}

async function deleteCode(role, id) {
    if (confirm("确定要删除吗？")) {
        await db.collection(role).doc(id).delete();
        alert("删除成功！");
    }
}

async function editCode(role, id, oldCode) {
    const newCode = prompt("请输入新的编号：", oldCode);
    if (newCode && /^\d{4}$/.test(newCode)) {
        await db.collection(role).doc(id).update({ code: newCode });
        alert("修改成功！");
    } else {
        alert("请输入有效的 4 位数字编号！");
    }
}

// 加载数据
loadData("courier");
loadData("student");