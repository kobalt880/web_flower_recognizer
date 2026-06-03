import { sendPostQuery, redirect, getAccountData } from '/sf/main_script.js';
const logoutPostAddr = '/logout';


async function logout() {
    let scfl;
    await sendPostQuery(logoutPostAddr, {}, function(response) {
        scfl = response.scfl;
    });

    if(scfl) {
        alert('Успешно выполнен выход из аккаунта');
        redirect('/');
    }
    else { alert('Непредвиденная ошибка: не удалось выйти из аккаунта'); }
}


async function initPage() {
    const account = await getAccountData();
    if(account !== null) {
        const label = document.getElementById('greet');
        label.textContent = `Здравствуйте, ${account.name}!`;
    }
    else {
        alert('Не удалось получить ваше имя');
    }
}

await initPage();
window.logoutGlobal = logout;