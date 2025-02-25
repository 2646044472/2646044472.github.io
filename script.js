// 🔥 Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCVB3quR4-fjIFzwNc83DZfECYTBpXhO8E",
    authDomain: "utat-56b2e.firebaseapp.com",
    projectId: "utat-56b2e",
    storageBucket: "utat-56b2e.firebasestorage.app",
    messagingSenderId: "559148636842",
    appId: "1:559148636842:web:7da66e4a8d8fe6debc0ed3",
    measurementId: "G-8DXJE6E2YL"
};

// ✅ 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// ✅ 获取 Firestore 数据库实例
const db = firebase.firestore();

// 选择身份，显示不同的输入框
function chooseRole(role) {
    document.getElementById('courier-section').classList.toggle('hidden', role !== 'courier');
    document.getElementById('student-section').classList.toggle('hidden', role !== 'student');
}

// 存储编号到 Firestore
async function saveCode(role) {
    let inputField = document.getElementById(role + '-code');
    let code = inputField.value.trim();

    if (/^\d{4}$/.test(code)) {
        try {
            await db.collection(role).add({
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