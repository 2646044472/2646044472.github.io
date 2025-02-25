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

// ✅ 安全初始化 Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase 初始化成功");
} catch (error) {
    console.error("Firebase 初始化失败:", error);
}

// 选择身份，显示不同的输入框
function chooseRole(role) {
    document.getElementById('courier-section').classList.toggle('hidden', role !== 'courier');
    document.getElementById('student-section').classList.toggle('hidden', role !== 'student');
}

// 带安全检查的提交函数
async function saveCodeWithCheck(role) {
    if (!db) {
        alert("系统正在初始化，请稍后再试");
        return;
    }

    const inputField = document.getElementById(role + '-code');
    const code = inputField.value.trim();

    if (/^\d{4}$/.test(code)) {
        try {
            await db.collection(role).add({
                code: code,
                timestamp: new Date()
            });
            alert("提交成功！");
            inputField.value = '';
        } catch (error) {
            alert(`提交失败：${error.message}`);
        }
    } else {
        alert('请输入四位数字编号！');
    }
}