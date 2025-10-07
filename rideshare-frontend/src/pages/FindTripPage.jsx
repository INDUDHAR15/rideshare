import React, { useEffect, useState } from 'react';
import { findTrips } from '../services/api';
import { Link } from 'react-router-dom';

export default function FindTripPage() {
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    const load = async () => {
      const res = await findTrips();
      setTrips(res.data);
    };
    load();
  }, []);
  return (
    <div>
      <h2>Available Trips</h2>
      <ul>
        {trips.map((t) => (
          <li key={t.id}>
            {t.origin} → {t.destination} ({t.seats} seats)
            <Link to={`/trip/${t.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}