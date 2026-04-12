import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); // Bypass untuk percubaan sistem
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '0.2rem', color: 'white', fontWeight: 700 }}>
          Log Masuk
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Sistem Pengurusan Premium AutoCare
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="premium-label">Emel Pengguna</label>
            <input 
              type="email" 
              className="premium-input" 
              placeholder="admin@autocare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label className="premium-label">Kata Laluan</label>
            <input 
              type="password" 
              className="premium-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Masuk Sistem ⚡
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
