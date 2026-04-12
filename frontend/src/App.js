import React, { useState } from 'react';
import Login from './pages/Login';
import RegistrasiPelanggan from './pages/RegistrasiPelanggan';
import DashboardPimpinan from './pages/DashboardPimpinan';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div className="app">
      {currentPage === 'login' && <Login onLogin={() => setCurrentPage('dashboard')} />}
      
      {currentPage !== 'login' && (
        <div className="dashboard-container">
          <aside className="sidebar glass-card" style={{borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0}}>
            <h2 style={{color: 'white', marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700}}>
              Auto<span style={{color: 'var(--primary)'}}>Care</span>
            </h2>
            <nav>
              <div aria-label="Dashboard" className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
                📊 Dashboard Utama
              </div>
              <div aria-label="Register" className={`nav-item ${currentPage === 'register' ? 'active' : ''}`} onClick={() => setCurrentPage('register')}>
                👥 Registrasi Pelanggan
              </div>
              <div aria-label="Stock" className={`nav-item ${currentPage === 'suku_cadang' ? 'active' : ''}`} onClick={() => setCurrentPage('suku_cadang')}>
                ⚙️ Inventori Barang
              </div>
            </nav>
            <div style={{marginTop: 'auto'}}>
              <button 
                onClick={() => setCurrentPage('login')} 
                className="btn-primary" 
                style={{background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', boxShadow: 'none'}}
              >
                Log Keluar
              </button>
            </div>
          </aside>
          
          <main className="main-content">
            {currentPage === 'register' && <RegistrasiPelanggan />}
            {currentPage === 'dashboard' && <DashboardPimpinan />}
            {currentPage === 'suku_cadang' && <div className="glass-card"><h2 style={{color:'white'}}>Akan Datang</h2></div>}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
