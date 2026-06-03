import { getAccountData } from '/sf/main_script.js';


async function initPage() {
    const account = await getAccountData();

    if(account !== null) {
        const username = document.getElementById('username');
        const name = document.getElementById('name');
        const surname = document.getElementById('surname');
        const pn = document.getElementById('pn');
    
        username.textContent = `Псевдоним: ${account.username}`;
        name.textContent = `Имя: ${account.name}`;
        surname.textContent = `Фамилия: ${account.surname}`;
        pn.textContent = `Номер телефона: ${account.pn}`;
    }
    else {
        alert('Произошла ошибка: не удалось получить данные вашего аккаунта.');
    }
}

initPage();
