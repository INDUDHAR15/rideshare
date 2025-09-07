from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=schemas.BookingOut)
def create_booking(b: schemas.BookingCreate, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == b.trip_id).with_for_update().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if b.seats_booked <= 0:
        raise HTTPException(status_code=400, detail="seats_booked must be >= 1")
    if trip.available_seats < b.seats_booked:
        raise HTTPException(status_code=400, detail="Not enough seats available")
    # verify passenger exists
    passenger = db.query(models.User).filter(models.User.id == b.passenger_id).first()
    if not passenger:
        raise HTTPException(status_code=400, detail="Passenger not found")

    trip.available_seats -= b.seats_booked
    booking = models.Booking(trip_id=b.trip_id, passenger_id=b.passenger_id, seats_booked=b.seats_booked)
    db.add(booking)
    db.add(trip)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/by-user/{user_id}", response_model=list[schemas.BookingOut])
def bookings_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Booking).filter(models.Booking.passenger_id == user_id).all()
