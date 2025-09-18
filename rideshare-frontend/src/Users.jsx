import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // backend FastAPI URL

export default function Users() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", gender: "male" });
  const [users, setUsers] = useState([]);

  const register = async () => {
    try {
      await axios.post(`${API_URL}/users/register`, form);
      alert("User registered!");
      fetchUsers();
    } catch (err) {
      alert("Error registering user");
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/users`);
    setUsers(res.data);
  };

  return (
    <div>
      <h2>Users</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, gender: e.target.value })}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="any">Any</option>
      </select>
      <button onClick={register}>Register</button>
      <button onClick={fetchUsers}>Fetch Users</button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
