const db = firebase.firestore();

function loadData(role) {
    const listElement = document.getElementById(role + '-data');
    db.collection(role).orderBy("timestamp", "desc").onSnapshot(snapshot => {
        listElement.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `编号: ${data.code} - 时间: ${data.timestamp.toDate().toLocaleString()}`;
            listElement.appendChild(listItem);
        });
    });
}

// 加载数据
loadData("courier");
loadData("student");