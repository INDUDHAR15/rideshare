from fastapi import FastAPI
import models
from database import engine, Base
from routers import auth, trips, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RideShare API")

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(bookings.router)
