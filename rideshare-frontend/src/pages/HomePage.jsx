import React from 'react';
import { Link } from 'react-router-dom';
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to RideShare</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}