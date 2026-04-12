import React from 'react';

function DashboardPimpinan() {
  return (
    <div style={{animation: 'slideIn 0.5s ease-out'}}>
      <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'white' }}>
              Statistik AutoCare
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Analitik data perniagaan tepat pada masanya.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.1}}>👥</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>Jumlah Pelanggan</h3>
          <p style={{ fontSize: '3rem', fontWeight: 700, margin: '0.5rem 0 0 0', color: 'white' }}>192</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #ec4899', position: 'relative', overflow: 'hidden' }}>
          <div style={{position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.1}}>💰</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>Pendapatan Bersih (MYR)</h3>
          <p style={{ fontSize: '3rem', fontWeight: 700, margin: '0.5rem 0 0 0', color: 'white' }}>RM 24K</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
          <div style={{position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.1}}>⚙️</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>Surat Perintah Kerja (Aktif)</h3>
          <p style={{ fontSize: '3rem', fontWeight: 700, margin: '0.5rem 0 0 0', color: 'white' }}>18</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPimpinan;
