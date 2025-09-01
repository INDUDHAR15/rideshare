from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def book_seat(tripId: int, passengerId: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.availableSeats <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    passenger = db.query(models.User).filter(models.User.id == passengerId).first()
    if not passenger:
        raise HTTPException(status_code=404, detail="Passenger not found")

    if trip.genderPreference != models.Preference.anyone and passenger.gender != trip.genderPreference:
        raise HTTPException(status_code=403, detail=f"This trip is restricted to {trip.genderPreference} passengers only")

    booking = models.Booking(tripId=tripId, passengerId=passengerId)
    trip.availableSeats -= 1

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
