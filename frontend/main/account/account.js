import { sendPostQuery, redirect, getAccountData } from '/sf/main_script.js';
const deletePostAddr = '/delete_acc';
const account = await getAccountData();


async function initPage() {
    if(account !== null) {
        const username = document.getElementById('username');
        const name = document.getElementById('name');
        const surname = document.getElementById('surname');
        const pn = document.getElementById('pn');
    
        username.textContent = account.username;
        name.textContent = account.name;
        surname.textContent = account.surname;
        pn.textContent = account.pn;
        document.title = account.username;
    }
    else {
        alert('Произошла ошибка: не удалось получить данные вашего аккаунта.');
    }
}

async function deleteAccount() {
    const cont = confirm('Аккаунт будет удален без возможности восстановления.\n' + 
        'Вы действительно хотите удалить текущий аккаунт?');

    if(cont) {
        let scfl;
        await sendPostQuery(deletePostAddr, {}, function(response) {
            scfl = response.scfl;
        });
    
        if(scfl) {
            alert(`Аккаунт под имменем ${account.username} был безвозвратно удален.`);
            redirect('/');
        }
        else { alert('Не удалось удалить аккаунт'); }
    }
}

initPage();
window.deleteGlobal = deleteAccount;
