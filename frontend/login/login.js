import { sendPostQuery, redirect } from '/sf/main_script.js';
const postQueryAddress = '/login_data';

// ------- login ------- //
async function login(username, password, responseHandler) {
    /* returns -1 by invalid data */
    const queryBody = {
        username: username,
        password: password
    };
    await sendPostQuery(postQueryAddress, queryBody, responseHandler);
}

async function loginWrapper() {
    const username = document.getElementById('username-inp').value.trim();
    const password = document.getElementById('password-inp').value.trim();

    if(username === '' || password === '') {
        alert('Сначала заполните поля');
        return;
    }

    await login(username, password,
        function(response) {
            const id = response.id;

            if(id === -1) { alert('Неверно введены данные'); }
            else {
                alert('Вы успешно вошли в аккаунт');
                redirect('/');
            }
        }
    );
}

window.loginWrapper = loginWrapper;
