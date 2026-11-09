import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

default_sqlite = "sqlite:////tmp/bula_mebel.db" if os.environ.get("VERCEL") else "sqlite:///./sql_app.db"
SQLALCHEMY_DATABASE_URL = os.environ.get("POSTGRES_URL", default_sqlite)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

def _create_engine(database_url):
    engine_kwargs = {}
    if database_url.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(database_url, **engine_kwargs)

try:
    engine = _create_engine(SQLALCHEMY_DATABASE_URL)
except Exception:
    if not os.environ.get("VERCEL"):
        raise
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/bula_mebel.db"
    engine = _create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def initialize_database():
    """Create tables and keep Vercel usable if an attached Postgres URL is stale."""
    global engine, SQLALCHEMY_DATABASE_URL
    try:
        Base.metadata.create_all(bind=engine)
        return
    except Exception:
        if not os.environ.get("VERCEL") or SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            raise

    engine.dispose()
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/bula_mebel.db"
    engine = _create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal.configure(bind=engine)
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
