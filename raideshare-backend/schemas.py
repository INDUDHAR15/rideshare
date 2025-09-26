from pydantic import BaseModel
from datetime import date, time

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config: orm_mode = True

class TripCreate(BaseModel):
    origin: str
    destination: str
    date: date
    time: time
    seats_available: int
    price: float

class TripOut(TripCreate):
    id: int
    driver_id: int
    class Config: orm_mode = True

class BookingCreate(BaseModel):
    trip_id: int

class BookingOut(BaseModel):
    id: int
    trip_id: int
    passenger_id: int
    status: str
    class Config: orm_mode = True
