import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function CreateTripPage() {
  const [form, setForm] = useState({
    driver_id: "",         // user ID after login
    origin: "",
    destination: "",
    departure_time: "",
    available_seats: "",
    gender_preference: "anyone"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/trips/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          departure_time: new Date(form.departure_time).toISOString() // ✅ datetime format
        }),
      });
      if (!res.ok) throw new Error("Failed to create trip");
      alert("Trip created successfully 🚗");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a Trip</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="driver_id" placeholder="Driver ID" value={form.driver_id} onChange={handleChange} required /><br />
        <input type="text" name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} required /><br />
        <input type="text" name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required /><br />
        <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={handleChange} required /><br />
        <input type="number" name="available_seats" placeholder="Available Seats" value={form.available_seats} onChange={handleChange} required /><br />
        
        <select name="gender_preference" value={form.gender_preference} onChange={handleChange}>
          <option value="anyone">Anyone</option>
          <option value="male">Male Only</option>
          <option value="female">Female Only</option>
        </select><br />

        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
}
