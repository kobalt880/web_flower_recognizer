from database import Database, IntegrityError
from fastapi import FastAPI, Body, Cookie, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

app = FastAPI()
app.mount('/sf', StaticFiles(directory='../frontend', html=True))


@app.get('/', response_class=RedirectResponse)
def main(id: str | None = Cookie(default=None)):
    if id is None:
        return '/sf'
    else:
        return '/sf/main'


# registration
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


# getting data
@app.post('/get_acc_data')
def get_acc_data(id: str | None = Cookie(default=None)):
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
