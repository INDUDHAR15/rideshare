import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import CreateTripPage from './pages/CreateTripPage';
import FindTripPage from './pages/FindTripPage';
import TripDetailsPage from './pages/TripDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/role" element={<RoleSelectionPage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/find-trip" element={<FindTripPage />} />
        <Route path="/trip/:id" element={<TripDetailsPage />} />
      </Routes>
    </Router>
  );
}
export default App;