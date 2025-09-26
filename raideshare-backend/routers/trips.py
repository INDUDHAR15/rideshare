from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import SessionLocal

router = APIRouter(prefix="/trips", tags=["trips"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TripOut)
def create_trip(trip: schemas.TripCreate, driver_id: int, db: Session = Depends(get_db)):
    db_trip = models.Trip(driver_id=driver_id, **trip.dict())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.get("/", response_model=list[schemas.TripOut])
def search_trips(origin: str, destination: str, date: str, db: Session = Depends(get_db)):
    return db.query(models.Trip).filter(models.Trip.origin == origin, models.Trip.destination == destination, models.Trip.date == date).all()
