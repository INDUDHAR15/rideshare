from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from utils import get_db, get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/", response_model=schemas.TripOut)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can create trips")
    db_trip = models.Trip(driver_id=current_user.id, **trip.dict())
    db.add(db_trip); db.commit(); db.refresh(db_trip)
    return db_trip

@router.get("/", response_model=list[schemas.TripOut])
def search_trips(origin: str, destination: str, date: str, db: Session = Depends(get_db)):
    return db.query(models.Trip).filter(models.Trip.origin == origin, models.Trip.destination == destination, models.Trip.date == date).all()
