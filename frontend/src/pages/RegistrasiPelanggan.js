import React, { useState } from 'react';

function RegistrasiPelanggan() {
    const [nama, setNama] = useState('');
    const [telepon, setTelepon] = useState('');
    const [alamat, setAlamat] = useState('');
    const [notification, setNotification] = useState(null);

    const handleSimpan = async (e) => {
        e.preventDefault();
        setNotification(null);

        try {
            const response = await fetch('http://localhost:5000/api/pelanggan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama_pelanggan: nama,
                    no_telepon: telepon,
                    alamat: alamat
                })
            });

            const result = await response.json();

            if (response.ok && result.status === true) {
                setNotification({ type: 'success', message: '✅ ' + result.message });
                setNama('');
                setTelepon('');
                setAlamat('');
            } else {
                setNotification({ type: 'error', message: '❌ ' + (result.message || 'Gagal menyimpan data.') });
            }
        } catch (error) {
            setNotification({ type: 'error', message: '❌ Ralat Servis API. Pastikan server.js menyala.' });
        }
    };

    return (
        <div style={{animation: 'slideIn 0.5s ease-out'}}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'white' }}>
                    Pendaftaran Pelanggan
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Rekod pelanggan baharu ke dalam Pangkalan Data AutoCare.</p>
            </div>

            <div className="glass-card" style={{ maxWidth: '650px' }}>
                {notification && (
                    <div className={notification.type === 'success' ? 'alert-success' : 'alert-error'}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSimpan}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="premium-label">Nama Pelanggan (Pemilik Kenderaan)</label>
                        <input 
                            type="text" 
                            className="premium-input" 
                            placeholder="Contoh: Tengku Ismail"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="premium-label">Nombor Telefon</label>
                        <input 
                            type="tel" 
                            className="premium-input" 
                            placeholder="Contoh: 019-2345678"
                            value={telepon}
                            onChange={(e) => setTelepon(e.target.value)}
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label className="premium-label">Alamat Penagihan Invois</label>
                        <textarea 
                            className="premium-input" 
                            rows="4" 
                            placeholder="Sila masukkan alamat penuh..."
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        ✨ Simpan Data Pelanggan Baru
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistrasiPelanggan;
