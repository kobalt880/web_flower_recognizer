import { sendPostQuery, redirect, getAccountData } from '/sf/main_script.js';
const logoutPostAddr = '/logout';


async function logout() {
    const cont = confirm('Вы действительно хотите выйти из аккаунта?\n' + 
        'Вам придется заново вводить пароль и логин чтобы вернуться');

    if(cont) {
        let scfl;

        await sendPostQuery(logoutPostAddr, {}, function(response) {
            scfl = response.scfl;
        });
    
        if(scfl) { redirect('/'); }
        else { alert('Непредвиденная ошибка: не удалось выйти из аккаунта'); }
    }
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
