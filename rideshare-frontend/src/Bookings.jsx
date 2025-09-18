import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/bookings/`)
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error("Error loading bookings:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            Trip #{booking.trip_id} booked by Passenger #{booking.passenger_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
