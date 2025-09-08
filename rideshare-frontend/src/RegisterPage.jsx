import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', gender:'male' });
  const [resMsg, setResMsg] = useState(null);
  const nav = useNavigate();

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    const r = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await r.json();
    setResMsg(data);
    if (r.ok) {
      nav("/login");
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} /><br/>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} /><br/>
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} /><br/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} /><br/>
        <select name="gender" value={form.gender} onChange={onChange}>
          <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
        </select><br/>
        <button type="submit">Register</button>
      </form>
      <pre>{JSON.stringify(resMsg, null, 2)}</pre>
    </div>
  );
}
