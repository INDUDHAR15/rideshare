from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from utils import get_db, get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "passenger":
        raise HTTPException(status_code=403, detail="Only passengers can book trips")
    db_booking = models.Booking(trip_id=booking.trip_id, passenger_id=current_user.id)
    db.add(db_booking); db.commit(); db.refresh(db_booking)
    return db_booking
