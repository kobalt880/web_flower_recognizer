import { sendPostQuery } from '/sf/main_script.js';
const getHistoryAddr = '/get_hist';
const clearHistoryAddr = '/cl_hist';

/* getting */
function createNote(textContent, imgPath) {
    const div = document.createElement('div');
    const predInfo = document.createElement('span');
    const imgLink = document.createElement('a');

    predInfo.textContent = textContent;
    imgLink.href = imgPath;
    imgLink.textContent = 'Open img.'

    div.appendChild(predInfo);
    div.appendChild(imgLink);
    return div;
}

function getFirst(string) {
    let result = ''; let cChar;

    for(let i = 0; i < string.length; i++) {
        cChar = string[i];
        if(cChar !== ',') { result += cChar; }
        else { break; }
    }

    return result;
}

async function getHistory() {
    let history;  // list[tuple[str, str, str | None]]

    await sendPostQuery(getHistoryAddr, {}, function(response) {
        if(response.scfl) { history = response.history; }
        else { history = null; }
    });

    return history;
}

async function showHistory() {
    const history = await getHistory();
    
    if(history !== null) {
        const list = document.getElementById('history-list');
        let pred; let conf; let img; let noteDiv;
        
        history.forEach(note => {
    
            pred = getFirst(note[0]);
            conf = (parseFloat(getFirst(note[1])) * 100).toFixed(2);
            img = note[2];
    
            noteDiv = createNote(`${pred} (${conf}%)`, '#');
            list.appendChild(noteDiv);
    
        });
        
        if(history.length > 0) {
            const emptySpan = document.getElementById('is-empty');
            emptySpan.textContent = '';
        }
    }
    else { alert('Не удалось загрузить вашу историю'); }
}

/* cleaning */
async function clearHistory() {
    const cont = confirm('Вы действительно хотите очистить историю?');

    if (cont) {
        let scfl;
        
        await sendPostQuery(clearHistoryAddr, {}, response => {
            scfl = response.scfl;
        });
        
        if(!scfl) { alert('Не удалось очистить историю'); }
        else { deleteHistoryCards(); }
    }
}

function deleteHistoryCards() {
    const list = document.getElementById('history-list');
    
    while(list.hasChildNodes()) {
        list.removeChild(list.childNodes[0]);
    }
    
    const emptSpan = document.createElement('span');
    emptSpan.id = 'is-empty';
    emptSpan.textContent = 'Пока здесь ничего нет';
    list.appendChild(emptSpan);
}

await showHistory();
window.clearHistGlobal = clearHistory;
