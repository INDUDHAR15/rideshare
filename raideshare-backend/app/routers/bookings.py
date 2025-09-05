from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# Passenger books a trip
@router.post("/")
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == booking.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # Reduce available seats
    trip.available_seats -= 1

    new_booking = models.Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

# Get all bookings of a passenger
@router.get("/{passenger_id}")
def get_bookings(passenger_id: int, db: Session = Depends(get_db)):
    return db.query(models.Booking).filter(models.Booking.passenger_id == passenger_id).all()
