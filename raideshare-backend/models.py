from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Numeric
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(120), unique=True, index=True)
    password_hash = Column(String)
    role = Column(String(20))  # driver | passenger
    trips = relationship("Trip", back_populates="driver")
    bookings = relationship("Booking", back_populates="passenger")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    origin = Column(String(100))
    destination = Column(String(100))
    date = Column(Date)
    time = Column(Time)
    seats_available = Column(Integer)
    price = Column(Numeric)

    driver = relationship("User", back_populates="trips")
    bookings = relationship("Booking", back_populates="trip")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    passenger_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")

    trip = relationship("Trip", back_populates="bookings")
    passenger = relationship("User", back_populates="bookings")
