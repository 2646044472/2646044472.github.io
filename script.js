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

function chooseRole(role) {
    document.getElementById('courier-section').style.display = (role === 'courier') ? 'block' : 'none';
    document.getElementById('student-section').style.display = (role === 'student') ? 'block' : 'none';
}

async function saveCode(role) {
    let inputField = document.getElementById(role + '-code');
    let code = inputField.value.trim();

    if (/^\d{4}$/.test(code)) {  // 只允许4位数字
        try {
            const docRef = await db.collection(role).add({
                code: code,
                timestamp: new Date()
            });
            console.log("数据存入成功，ID:", docRef.id);
            alert("提交成功！");
            inputField.value = ''; // 清空输入框
        } catch (error) {
            console.error("存储失败:", error);
            alert("存储失败：" + error.message);
        }
    } else {
        alert('请输入四位数字编号！');
    }
}