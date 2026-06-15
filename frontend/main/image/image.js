import { sendPostQuery, sendImage } from "/sf/main_script.js";

const predPostAddr = '/predict';
const savePostAbbr = '/hist_add';


function showImage() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if(file !== undefined && file.type.slice(0, 5) === 'image') {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.getElementById('preview');
            img.src = reader.result;
        }
        reader.readAsDataURL(file);
    
        const imgDiv = document.getElementById('image-container');
        const resDiv = document.getElementById('result-card');
        imgDiv.style.backgroundColor = resDiv.style.backgroundColor = '#000a';
    }
}

function setLoadingStatus() {
    const predDiv = document.getElementById('pred');
    const confDiv = document.getElementById('conf');

    const predChildren = predDiv.childNodes;
    const confChildren = confDiv.childNodes;

    while(predDiv.hasChildNodes() || confDiv.hasChildNodes()) {
        predDiv.removeChild(predChildren[0]);
        confDiv.removeChild(confChildren[0]);
    }
    
    const loadingSpan = document.getElementById('loading');
    loadingSpan.textContent = 'Загрузка...';
}

function showPredictionResult(prediction) {
    const infoDiv = document.getElementById('info');
    infoDiv.style.backgroundColor = '#000a';

    {
        const predDiv = document.getElementById('pred');
        const confDiv = document.getElementById('conf');

        {
            const classes = `Тип цветка, ${prediction.pred}`.split(', ');
            const confs = `Уверенность модели, ${prediction.conf}`.split(', ');
            let span;

            for(let i = 0; i < classes.length; i++) {
                span = document.createElement('span');
                if(i === 0) { span.style.fontWeight = 'bold'; }
                span.textContent = classes[i];
                predDiv.appendChild(span);

                span = document.createElement('span');
                let addChar = '%';

                if(i === 0) {
                    span.style.fontWeight = 'bold';
                    addChar = '';
                }

                span.style.textAlign = 'right';
                span.textContent = confs[i] + addChar;
                confDiv.appendChild(span);
            }
        }
    }
    
    const loadingSpan = document.getElementById('loading');
    loadingSpan.textContent = '';
}

async function getPrediction(file) {
    if(file === undefined) {
        alert('Сначала загрузите изображение');
        return { good: false };
    }
    else if(file.type.slice(0, 5) !== 'image') {
        alert(`Тип файла не поддерживается`);
        return { good: false };
    }
    setLoadingStatus();

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
        reader.onload = async function() {
            await savePrediction(prediction, reader.result);
            showPredictionResult(prediction);
        }
        reader.readAsDataURL(file);
    }
}

window.recognizeGlobal = recognize;
window.onLoadGlobal = showImage;
