import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function RoleSelectionPage() {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const [role, setRole] = useState(user?.role || "passenger");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const res = await fetch(`${API_BASE}/users/${user.id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setMsg(`Role updated to ${data.role}`);

      // ✅ redirect to correct page
      if (data.role === "driver") {
        navigate("/trips");
      } else {
        navigate("/find");
      }
    } else {
      setMsg(`Error: ${data.detail}`);
    }
  };

  if (!user) return <p>Please login first.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Role</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="driver">Driver / Owner</option>
        <option value="passenger">Passenger</option>
      </select>
      <button onClick={handleSave} style={{ marginLeft: 10 }}>Save</button>
      <p>{msg}</p>
    </div>
  );
}
