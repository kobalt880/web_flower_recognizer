// http functions
async function sendPostQuery(addr, bodyObject, responseHandler) {
    const response = await fetch(addr, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(bodyObject)
    });

    if(response.ok) {
        responseHandler(await response.json());
    } else {
        alert(`Response ${addr} is not okay`);
    }
}

async function sendImage(addr, imageFile, responseHandler) {
    const response = await fetch(addr, {
        method: 'POST',
        headers: { 'Accept': "application/json" },
        body: imageFile
    });

    if(response.ok) {
        responseHandler(await response.json());
    } else {
        alert(`Response ${addr} is not okay`);
    }
}

async function getAccountData() {
    // returns account object or null value
    let accountObject;

    await sendPostQuery('/get_acc_data', {}, function(response) {
        if(response.scfl) { accountObject = response; }
        else {accountObject = null; }
    });

    return accountObject;
}

function redirect(addr) {
    window.location.assign(addr);
}

// other functions
function isSpace(string) {
    let cChar;
    let isspace = true;

    for(let i = 0; i < string.length; i++) {
        cChar = string[i];

        if(cChar !== ' ' && cChar !== '\n' && cChar !== '\t') {
            continue;
        }
        else {
            isspace = false;
            break;
        }
    }
    
    return isspace;
}

export {
    isSpace, redirect, sendImage,
    sendPostQuery, getAccountData
}
