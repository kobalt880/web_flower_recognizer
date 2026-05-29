from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session, Query
from sqlalchemy import create_engine, Column, Integer, String


class Base(DeclarativeBase): pass
engine = create_engine(
    'sqlite:///./database.db',
    connect_args={"check_same_thread": False}
)


class Account(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)


class History(Base):
    __tablename__ = 'History'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    predicted_class = Column(String, nullable=False)
    image_path = Column(String)


Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


def with_session(func: callable) -> callable:

    def wrapper(*args, **kwargs):
        session = SessionLocal()
        func_result = func(*args, **kwargs, session=session)
        session.commit()
        session.close()
        
        return func_result
    
    return wrapper


def static_session(func: callable) -> callable:
    func = staticmethod(func)
    func = with_session(func)
    return func


def create_query(session: Session, table_class: type, *filters) -> Query:
    query = session.query(table_class)

    for filter in filters:
        query = query.filter(filter)

    return query


class Database:

    @static_session
    def register(username: str, password: str, name: str,
                 surname: str, phone_number: str, session: Session):
        
        account = Account(
            username=username, password=password, name=name,
            surname=surname, phone_number=phone_number
        )

        session.add(account)

    @static_session
    def login(username: str, password: str, session: Session) -> int | None:
        query = create_query(
            session, Account,
            Account.username == username,
            Account.password == password
        )
        account = query.first()
        if account is not None: return account.id
    
    @static_session
    def delete_account(id: int, session: Session) -> bool:
        query = session.query(Account).filter(Account.id == id)
        account = query.first()

        if account is not None:
            session.delete(account)
            return True
        
        else: return False

    @static_session
    def get_account(id: int, session: Session) -> tuple | None:
        query = create_query(session, Account, Account.id == id)
        account: Account = query.first()

        if account is not None:
            return (
                account.id, account.username,
                account.password, account.name,
                account.surname, account.phone_number
            )
    
    @static_session
    def edit_account(id: int, session: Session, **kwargs) -> bool:
        '''Can be raised the AttributeError.'''

        query = create_query(session, Account, Account.id == id)
        account: Account = query.first()

        if account is not None:

            for key, value in kwargs.items():

                if not hasattr(account, key):
                    raise AttributeError(f'Attribute "{key}" is not exists')
                
                if key not in ('metadata', 'registry'):
                    account.__setattr__(key, value)

                else:
                    raise AttributeError('Attributes "metadata" and "registry" is not allowed')

            return True

        else: return False

    @static_session
    def add_history_note(user_id: int, predicted_class: str,
                           session: Session, image_path: str | None = None):
        note = History(
            user_id=user_id,       
            predicted_class=predicted_class,
            image_path=image_path
        )
        session.add(note)

    @static_session
    def get_history(user_id: int, session: Session) -> list[tuple[str, str | None]]:
        query = create_query(session, History, History.user_id == user_id)
        history = query.all()

        return list(map(
            lambda hist: (hist.predicted_class, hist.image_path),
            history
        ))

    @static_session
    def clear_history(user_id: int, session: Session):
        query = create_query(session, History, History.user_id == user_id)
        history = query.all()

        for note in history: session.delete(note)
