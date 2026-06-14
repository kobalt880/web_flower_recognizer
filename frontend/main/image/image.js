import { sendPostQuery, sendImage } from "/sf/main_script.js";

const predPostAddr = '/predict';
const savePostAbbr = '/hist_add';


function showImage() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if(file !== undefined) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.getElementById('preview');
            img.src = reader.result;
        }
        reader.readAsDataURL(file);
    
        const div = document.getElementById('result-card');
        div.class = 'flex container';
    }
}

function showPredictionResult(prediction) {
    alert(`${prediction.pred}; ${prediction.conf}`);
}

async function getPrediction(file) {
    if(file === undefined) {
        alert('Сначала загрузите изображение');
        return { good: false };
    }
    else if(file.type.slice(0, 5) !== 'image') {
        alert(`Тип файла не поддерживается (debug: "${file.type.slice(0, 5)}")`);
        return { good: false };
    }

    let pred; let conf; let scfl
    await sendImage(predPostAddr, file, response => {
        scfl = response.scfl;

        if(scfl) {
            pred = response.pred;
            conf = response.conf;
        }
        else { alert('Не удалось получить предсказание'); }
    });

    return { good: scfl, pred: pred, conf: conf };
}

async function savePrediction(prediction, imageDataUrl) {
    let bodyObject = {
        pred: prediction.pred,
        conf: prediction.conf,
        img_url: imageDataUrl
    };

    await sendPostQuery(savePostAbbr, bodyObject, response => {
        if(!response.scfl) { alert('Не удалось сохранить действие в истории'); }
    });
}

async function recognize() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const prediction = await getPrediction(file);

    if(prediction.good) {
        const reader = new FileReader();
        reader.onload = () => {
            savePrediction(prediction, reader.result);
            showPredictionResult(prediction);
        }
        reader.readAsDataURL(file);
    }
}

window.recognizeGlobal = recognize;
window.onLoadGlobal = showImage;
