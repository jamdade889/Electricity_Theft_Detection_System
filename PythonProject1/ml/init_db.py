# # init_db.py
# from database import engine
# from ml_models import Base
#
# Base.metadata.create_all(bind=engine)
# print("Database created successfully")
from database import engine, Base

Base.metadata.create_all(bind=engine)

print("✅ Database created successfully")