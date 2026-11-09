import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

default_sqlite = "sqlite:////tmp/bula_mebel.db" if os.environ.get("VERCEL") else "sqlite:///./sql_app.db"
SQLALCHEMY_DATABASE_URL = os.environ.get("POSTGRES_URL", default_sqlite)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine_kwargs = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
