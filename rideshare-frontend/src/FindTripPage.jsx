import React, { useState } from "react";
import { API_BASE } from "../config";

export default function FindTripPage(){
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  const [search, setSearch] = useState({ origin: "", destination: ""});
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setSearch({...search, [e.target.name]: e.target.value});

  const handleSearch = async () => {
    setMsg("");
    const res = await fetch(`${API_BASE}/trips/search?origin=${encodeURIComponent(search.origin)}&destination=${encodeURIComponent(search.destination)}`);
    if (!res.ok) {
      const err = await res.json();
      setMsg(err.detail || "Error");
      setResults([]);
      return;
    }
    const data = await res.json();
    setResults(data || []);
  };

  const handleBooking = async (tripId) => {
    if (!user) { alert("Please login first"); return; }
    const seats = prompt("Enter seats to book (number)", "1");
    const seatsNum = parseInt(seats || "0", 10);
    if (!seatsNum || seatsNum < 1) { alert("Invalid seats"); return; }

    const res = await fetch(`${API_BASE}/bookings/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ trip_id: tripId, passenger_id: user.id, seats_booked: seatsNum })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Booking successful: " + JSON.stringify(data));
      // refresh results to show remaining seats
      handleSearch();
    } else {
      setMsg("Booking failed: " + (data.detail || JSON.stringify(data)));
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Find Trip</h2>
      <input name="origin" placeholder="Origin" value={search.origin} onChange={onChange} />
      <input name="destination" placeholder="Destination" value={search.destination} onChange={onChange} />
      <button onClick={handleSearch}>Search</button>

      <h3>Results</h3>
      {msg && <p>{msg}</p>}
      {results.length === 0 ? <p>No trips found</p> :
        <ul>
          {results.map(t => (
            <li key={t.id}>
              {t.origin} → {t.destination} at {new Date(t.departure_time).toLocaleString()} | Seats: {t.available_seats}
              <button onClick={() => handleBooking(t.id)} style={{marginLeft:10}}>Book Now</button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
