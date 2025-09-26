from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal

router = APIRouter(prefix="/bookings", tags=["bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, passenger_id: int, db: Session = Depends(get_db)):
    db_booking = models.Booking(trip_id=booking.trip_id, passenger_id=passenger_id)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
