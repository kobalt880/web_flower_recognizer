from database import Database, IntegrityError
from ai import *

from fastapi import FastAPI, Body, Cookie, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, HTMLResponse


with open('../frontend/file_view.html', 'r') as f:
    URL_FIELD = 'DATA_URL'
    file_view_html = f.read()


cache = {}
model = FlowersModel(3)
app = FastAPI()
app.mount('/sf', StaticFiles(directory='../frontend', html=True))


@app.get('/', response_class=RedirectResponse)
def main(id: str | None = Cookie(default=None)):
    if id is None:
        return '/sf'
    else:
        return '/sf/main'


@app.get('/file_view/{img}', response_class=HTMLResponse)
def file_view(img):
    img = img.replace('|', '/')
    return file_view_html.replace(URL_FIELD, img)


# account management
@app.post('/reg_data')
def register(data = Body()):
    scfl = True
    try:
        Database.register(
            data['username'],
            data['password'],
            data['name'],
            data['surname'],
            data['phoneNumber']
        )
    except IntegrityError: scfl = False
    return {'scfl': scfl}


@app.post('/login_data')
def login(response: Response, data = Body()):
    id: int | None = Database.login(
        data['username'], data['password']
    )

    if id is None:
        return {'id': -1}
    else:
        response.set_cookie(key='id', value=str(id))
        return {'id': id}


@app.post('/logout')
def logout(response: Response):
    scfl = True
    try: response.delete_cookie(key='id')
    except: scfl = False
    return {'scfl': scfl}


@app.post('/edit')
def edit_account(id: str | None = Cookie(default=None), data = Body()):
    message = ''

    if id is None:
        message = 'Кажется, вы еще не вошли в аккаунт. Нужно это исправить, слышите?'
        scfl = False

    else:
        try: scfl = Database.edit_account(id, **data)
        except IntegrityError:
            message =\
                'Введенное вами имя пользователя уже '\
                'было занято. Пожалуйста, выберите другое.'
            scfl = False

    return {'scfl': scfl, 'message': message}


@app.post('/delete_acc')
def delete_account(response: Response, id: str | None = Cookie(default=None)):
    scfl = False

    if id is not None:
        scfl = Database.delete_account(id)

        if scfl:
            Database.clear_history(id)
            response.delete_cookie(key='id')

    return {'scfl': scfl}


@app.post('/get_acc_data')
def send_acc_data(id: str | None = Cookie(default=None)):
    if id is None or (acc := Database.get_account(id)) is None:
        return {'scfl': False}
    
    else:
        _, username, password, name, surname, pn = acc
        return {
            'scfl': True,
            'username': username,
            'password': password,
            'name': name,
            'surname': surname,
            'pn': pn
        }


# history management
@app.post('/get_hist')
def send_history(id: str | None = Cookie(default=None)):
    if id is not None:
        history = Database.get_history(id)
        return {'scfl': True, 'history': history}

    return {'scfl': False}


@app.post('/cl_hist')
def clear_history(id: str | None = Cookie(default=None)):
    scfl = False

    if id is not None:
        try:
            Database.clear_history(id)
            scfl = True
        except: pass
    
    return {'scfl': scfl}


@app.post('/hist_add')
def add_history_note(id: str | None = Cookie(default=None), data = Body()):
    scfl = False

    if id is not None:
        Database.add_history_note(id,
            data['pred'], data['conf'],
            image_url=data['img_url']
        )
        scfl = True
    
    return {'scfl': scfl}


@app.post('/cache_img')
def cache_img(id: str | None = Cookie(default=None), data = Body()):
    if id is not None:
        cache[id] = data['img']
        return {'scfl': True}
    
    else: return {'scfl': False}


@app.post('/get_cached_img')
def send_cached_img(id: str | None = Cookie(default=None)):
    if id in cache.keys():
        print(cache[id], "RORI")
        return {'scfl': True, 'img': cache[id]}
    
    else: return {'scfl': False}


# prediction
@app.post('/predict')
def predict(image = Body()):
    try:
        pred, conf = model(image)
        return {'scfl': True, 'pred': pred, 'conf': conf}

    except: return {'scfl': False}
