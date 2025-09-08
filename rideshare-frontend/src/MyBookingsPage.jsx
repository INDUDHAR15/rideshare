import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function MyBookingsPage(){
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/bookings/by-user/${user.id}`)
      .then(r => r.json())
      .then(setBookings)
      .catch(console.error);
  }, [user]);

  if (!user) return <div style={{padding:20}}>Please login</div>;

  return (
    <div style={{padding:20}}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? <p>No bookings</p> :
        <ul>
          {bookings.map(b => (
            <li key={b.id}>Booking #{b.id} — Trip {b.trip_id} — Seats: {b.seats_booked}</li>
          ))}
        </ul>
      }
    </div>
  );
}
