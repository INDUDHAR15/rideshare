from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
import bcrypt

from app import models
from app.database import Base, engine, get_db

# Create tables
Base.metadata.create_all(bind=engine)

# -------------------------
# Schemas
# -------------------------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    gender: models.Gender

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    password: Optional[str]
    gender: Optional[models.Gender]

class TripCreate(BaseModel):
    origin: str
    destination: str
    availableSeats: int
    genderPreference: models.Preference = models.Preference.anyone
    driverId: int

class TripUpdate(BaseModel):
    origin: Optional[str]
    destination: Optional[str]
    availableSeats: Optional[int]
    genderPreference: Optional[models.Preference]

class BookingCreate(BaseModel):
    tripId: int
    passengerId: int

# -------------------------
# App
# -------------------------
app = FastAPI()

# -------------------------
# Health check
# -------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# -------------------------
# Users
# -------------------------
@app.post("/users/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_pw.decode("utf-8"),
        gender=user.gender,
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")
    return {"message": "User registered successfully", "user_id": db_user.id}

@app.post("/users/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not bcrypt.checkpw(credentials.password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": user.id}

@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).get(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict(exclude_unset=True).items():
        if key == "password":
            value = bcrypt.hashpw(value.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return {"message": "User updated", "user_id": db_user.id}

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).get(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted"}

# -------------------------
# Trips
# -------------------------
@app.post("/trips")
def create_trip(trip: TripCreate, db: Session = Depends(get_db)):
    db_trip = models.Trip(**trip.dict())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return {"message": "Trip created", "trip_id": db_trip.id}

@app.get("/trips")
def get_trips(db: Session = Depends(get_db)):
    return db.query(models.Trip).all()

@app.put("/trips/{trip_id}")
def update_trip(trip_id: int, trip: TripUpdate, db: Session = Depends(get_db)):
    db_trip = db.query(models.Trip).get(trip_id)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    for key, value in trip.dict(exclude_unset=True).items():
        setattr(db_trip, key, value)
    db.commit()
    db.refresh(db_trip)
    return {"message": "Trip updated"}

@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(models.Trip).get(trip_id)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(db_trip)
    db.commit()
    return {"message": "Trip deleted"}

# -------------------------
# Bookings
# -------------------------
@app.post("/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).get(booking.tripId)
    passenger = db.query(models.User).get(booking.passengerId)

    if not trip or not passenger:
        raise HTTPException(status_code=404, detail="Trip or passenger not found")

    if trip.genderPreference != models.Preference.anyone and trip.genderPreference != passenger.gender:
        raise HTTPException(status_code=400, detail=f"This trip is only for {trip.genderPreference}")

    if trip.availableSeats <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    db_booking = models.Booking(tripId=booking.tripId, passengerId=booking.passengerId)
    trip.availableSeats -= 1
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return {"message": "Booking created", "booking_id": db_booking.id}

@app.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):
    return db.query(models.Booking).all()

@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).get(booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    trip = db_booking.trip
    trip.availableSeats += 1
    db.delete(db_booking)
    db.commit()
    return {"message": "Booking deleted and seat restored"}
