from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app import models
from app.database import get_db

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/")
def create_trip(origin: str, destination: str, availableSeats: int, genderPreference: models.Preference = models.Preference.anyone, driverId: int = 1, db: Session = Depends(get_db)):
    trip = models.Trip(origin=origin, destination=destination, availableSeats=availableSeats, genderPreference=genderPreference, driverId=driverId)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip

@router.get("/")
def list_trips(filter: Optional[models.Preference] = None, db: Session = Depends(get_db)):
    query = db.query(models.Trip)
    if filter and filter != models.Preference.anyone:
        query = query.filter(models.Trip.genderPreference == filter)
    return query.all()
