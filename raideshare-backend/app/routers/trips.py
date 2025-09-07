from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("/", response_model=schemas.TripOut)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    # verify driver exists
    driver = db.query(models.User).filter(models.User.id == trip.driver_id).first()
    if not driver:
        raise HTTPException(status_code=400, detail="Driver_id not found")
    new = models.Trip(
        origin=trip.origin,
        destination=trip.destination,
        departure_time=trip.departure_time,
        available_seats=trip.available_seats,
        gender_preference=trip.gender_preference,
        driver_id=trip.driver_id,
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/", response_model=List[schemas.TripOut])
def list_trips(db: Session = Depends(get_db)):
    return db.query(models.Trip).all()

@router.get("/search", response_model=List[schemas.TripOut])
def search_trips(origin: str, destination: str, db: Session = Depends(get_db)):
    q = db.query(models.Trip).filter(models.Trip.origin.ilike(f"%{origin}%")).filter(models.Trip.destination.ilike(f"%{destination}%"))
    return q.all()

@router.get("/{trip_id}", response_model=schemas.TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    t = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Trip not found")
    return t
