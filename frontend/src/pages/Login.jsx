import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setToken } from "../lib/api.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { username, password });
      setToken(data.token);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div style={{color:"crimson", marginBottom:8}}>{error}</div>}
        <button className="button primary" type="submit">Login</button>
      </form>
      <p style={{marginTop:12}}>No account? <Link to="/signup">Create one</Link></p>
    </div>
  );
}
