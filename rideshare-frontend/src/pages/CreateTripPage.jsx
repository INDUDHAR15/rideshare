import React, { useState } from 'react';
import { createTrip } from '../services/api';

export default function CreateTripPage() {
  const [trip, setTrip] = useState({ origin: '', destination: '', seats: '' });
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrip(trip, token);
      alert('Trip created successfully!');
    } catch (err) {
      alert('Failed to create trip');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Trip</h2>
      <input placeholder="Origin" onChange={(e) => setTrip({ ...trip, origin: e.target.value })} />
      <input placeholder="Destination" onChange={(e) => setTrip({ ...trip, destination: e.target.value })} />
      <input placeholder="Seats" onChange={(e) => setTrip({ ...trip, seats: e.target.value })} />
      <button type="submit">Create</button>
    </form>
  );
}