import { redirect, sendPostQuery } from '/sf/main_script.js';
const editPostAddr = '/edit';


function getFieldValue(fieldId) {
    return document.getElementById(fieldId).value.trim();
}

async function editAccount(dataObject) {
    let scfl; let message;
    
    await sendPostQuery(editPostAddr, dataObject, function(response) {
        scfl = response.scfl;
        message = response.message;
    });

    if(scfl) { redirect('/sf/main/account'); }
    else { alert(message); }
}

async function editWrapper() {
    let dataObject = {};

    const username = getFieldValue('username');
    if(username !== '') { dataObject.username = username; }

    const password = getFieldValue('password');
    if(password !== '') { dataObject.password = password; }

    const name = getFieldValue('name');
    if(name !== '') { dataObject.name = name; }

    const surname = getFieldValue('surname');
    if(surname !== '') { dataObject.surname = surname; }

    const pn = getFieldValue('pn');
    if(pn !== '') { dataObject.phone_number = pn; }

    await editAccount(dataObject);
}

window.editWrapperGlobal = editWrapper;
