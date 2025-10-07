import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const handleSelect = (role) => {
    localStorage.setItem('role', role);
    if (role === 'driver') navigate('/create-trip');
    else navigate('/find-trip');
  };
  return (
    <div>
      <h2>Select your role</h2>
      <button onClick={() => handleSelect('driver')}>Driver</button>
      <button onClick={() => handleSelect('passenger')}>Passenger</button>
    </div>
  );
}