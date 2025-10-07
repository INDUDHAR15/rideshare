import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById } from '../services/api';

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getTripById(id);
      setTrip(res.data);
    };
    load();
  }, [id]);

  if (!trip) return <p>Loading...</p>;
  return (
    <div>
      <h2>Trip Details</h2>
      <p>Origin: {trip.origin}</p>
      <p>Destination: {trip.destination}</p>
      <p>Seats: {trip.seats}</p>
    </div>
  );
}