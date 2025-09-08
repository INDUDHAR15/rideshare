import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    trip_id: "",
    passenger_id: 1, // hardcoded, replace later with logged-in user
  });
  const [result, setResult] = useState(null);

  const fetchBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings/`);
    setBookings(await res.json());
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setResult(await res.json());
      fetchBookings();
    } catch (err) {
      setResult({ error: err.message });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bookings</h2>
      <form onSubmit={handleSubmit}>
        <input name="trip_id" placeholder="Trip ID" value={form.trip_id} onChange={handleChange} />
        <input name="passenger_id" placeholder="Passenger ID" value={form.passenger_id} onChange={handleChange} />
        <button type="submit">Book Trip</button>
      </form>

      <h3>All Bookings</h3>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            Trip #{b.trip_id} booked by Passenger #{b.passenger_id}
          </li>
        ))}
      </ul>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
