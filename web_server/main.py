from database import Database, IntegrityError
from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

app = FastAPI()
app.mount('/sf', StaticFiles(directory='../frontend', html=True))


@app.get('/', response_class=RedirectResponse)
def main(): return '/sf'


@app.get('/sf/{id}')
def user_enter(id: int):
    pass


@app.post('/reg_data')
def register(data = Body()):
    try:
        scfl = Database.register(
            data['username'],
            data['password'],
            data['name'],
            data['surname'],
            data['phoneNumber']
        )
    except IntegrityError: scfl = False
    return {'scfl': scfl}


@app.post('/login_data')
def login(data = Body()):
    id: int | None = Database.login(
        data['username'], data['password']
    )
    if id is None: return {'id': -1}
    else: return {'id': id}
