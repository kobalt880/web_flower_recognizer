import { sendPostQuery } from '/sf/main_script.js';
const getImgAddr = '/get_cached_img';


async function initImage() {
    await sendPostQuery(getImgAddr, {}, response => {

        if(response.scfl) {
            const img = document.getElementById('img');
            img.src = response.img;
        }
        else { alert('Ошибка: изображение не кэшировано'); }
    });
}


initImage();
