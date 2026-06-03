import { sendPostQuery, redirect } from "/sf/main_script.js";
const postQueryAddress = '/reg_data';

// ------- registration ------- //
async function register(username, password, name, surname, phoneNumber, responseHandler) {
    const queryBody = {
        username: username,
        password: password,
        name: name,
        surname: surname,
        phoneNumber: phoneNumber
    };

    await sendPostQuery(postQueryAddress, queryBody, responseHandler);
}

function checkRegData(username, password, name, surname, pn) {
    /* Эта функция ещё не доработана */

    if(username.trim() === '' || password.trim() === '' || name.trim() === '' ||
        surname.trim() === '' || pn.trim() === '') {
        alert('Сначала заполните все поля');
        return false;
    }
    return true;
}

async function registerWrapper() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const pnInput = document.getElementById('pn-input');
    
    if(!checkRegData(
        usernameInput.value, passwordInput.value,
        nameInput.value, surnameInput.value,
        pnInput.value
    )) { return; }

    await register(
        usernameInput.value.trim(), passwordInput.value.trim(),
        nameInput.value.trim(), surnameInput.value.trim(),
        pnInput.value.trim(),

        function(response) {
            if(response.scfl) {
                usernameInput.value = passwordInput.value = '';
                nameInput.value = surnameInput.value = pnInput.value = '';
                alert('Аккаунт успешно создан, теперь вам нужно в него войти.');
                redirect('/');
            }
            else { 
                alert('Указанный вами псевдоним уже занят. ' +
                    'Пожалуйста, выберите другой псевдоним.');
            }
        }
    );
}

window.registerWrapper = registerWrapper;
