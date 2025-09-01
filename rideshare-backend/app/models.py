from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class Gender(str, enum.Enum):
    male = "male"
    female = "female"

class Preference(str, enum.Enum):
    male = "male"
    female = "female"
    anyone = "anyone"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=True)
    password = Column(String, nullable=False)
    gender = Column(Enum(Gender), nullable=False)

    trips = relationship("Trip", back_populates="driver")
    bookings = relationship("Booking", back_populates="passenger")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    availableSeats = Column(Integer, nullable=False)
    genderPreference = Column(Enum(Preference), default=Preference.anyone)

    driverId = Column(Integer, ForeignKey("users.id"))
    driver = relationship("User", back_populates="trips")

    bookings = relationship("Booking", back_populates="trip")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    tripId = Column(Integer, ForeignKey("trips.id"))
    passengerId = Column(Integer, ForeignKey("users.id"))

    trip = relationship("Trip", back_populates="bookings")
    passenger = relationship("User", back_populates="bookings")
