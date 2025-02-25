// 🔥 初始化 Firebase
const firebaseConfig = {
    apiKey: "你的API密钥",
    authDomain: "你的项目ID.firebaseapp.com",
    projectId: "你的项目ID",
    storageBucket: "你的项目ID.appspot.com",
    messagingSenderId: "你的Sender ID",
    appId: "你的App ID"
};

// 只有在 Firebase 没有初始化时才初始化
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 🔥 初始化 Firestore
const db = firebase.firestore();

// 选择角色，显示不同输入框
function chooseRole(role) {
    document.getElementById('courier-section').classList.toggle('hidden', role !== 'courier');
    document.getElementById('student-section').classList.toggle('hidden', role !== 'student');
}

// 存储编号到 Firestore
async function saveCode(role) {
    if (!db) {
        alert("数据库未正确初始化，请刷新页面！");
        return;
    }

    let inputField = document.getElementById(role + '-code');
    let code = inputField.value.trim();

    if (/^\d{4}$/.test(code)) {
        try {
            const docRef = await db.collection(role).add({
                code: code,
                timestamp: new Date()
            });
            alert("提交成功！");
            inputField.value = '';
        } catch (error) {
            alert("存储失败：" + error.message);
        }
    } else {
        alert('请输入四位数字编号！');
    }
}