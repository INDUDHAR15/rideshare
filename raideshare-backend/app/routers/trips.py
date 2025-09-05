from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from typing import List

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/search", response_model=List[schemas.TripOut])
def search_trips(origin: str, destination: str, db: Session = Depends(get_db)):
    trips = (
        db.query(models.Trip)
        .filter(models.Trip.origin.ilike(f"%{origin}%"))
        .filter(models.Trip.destination.ilike(f"%{destination}%"))
        .all()
    )
    if not trips:
        raise HTTPException(status_code=404, detail="No trips found")
    return trips
