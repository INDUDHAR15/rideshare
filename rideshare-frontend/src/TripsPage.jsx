import React, { useState } from "react";
import { API_BASE } from "../config";

export default function TripsPage(){
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  const [form, setForm] = useState({
    driver_id: user?.id || "",
    origin: "",
    destination: "",
    departure_time: "",
    available_seats: 1,
    gender_preference: "anyone"
  });
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    // ISO datetime conversion if using local input
    const payload = {...form};
    if (!user) { setMsg("Login first"); return; }
    payload.driver_id = user.id;
    const r = await fetch(`${API_BASE}/trips/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    setMsg(data);
  };

  return (
    <div style={{padding:20}}>
      <h2>Create Trip</h2>
      {!user && <p>Please login</p>}
      <form onSubmit={onSubmit}>
        <input name="origin" placeholder="Origin" value={form.origin} onChange={onChange} /><br/>
        <input name="destination" placeholder="Destination" value={form.destination} onChange={onChange} /><br/>
        <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={onChange} /><br/>
        <input type="number" min="1" name="available_seats" value={form.available_seats} onChange={onChange} /><br/>
        <select name="gender_preference" value={form.gender_preference} onChange={onChange}>
          <option value="anyone">Anyone</option><option value="male">Male</option><option value="female">Female</option>
        </select><br/>
        <button type="submit">Create Trip</button>
      </form>
      <pre>{JSON.stringify(msg, null, 2)}</pre>
    </div>
  );
}
