import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);

    if (res.ok && data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/role");   // ✅ redirect to role selection
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} /><br/>
        <button type="submit">Login</button>
      </form>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
