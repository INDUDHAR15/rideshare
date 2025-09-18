import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/trips/`)
      .then((res) => res.json())
      .then(setTrips)
      .catch((err) => console.error("Error loading trips:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Trips</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {trip.origin} ➡ {trip.destination} | Seats: {trip.available_seats}
          </li>
        ))}
      </ul>
    </div>
  );
}
