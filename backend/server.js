// File: server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Memanggil file koneksi database agar langsung dites saat server menyala
const db = require('./config/db'); 

const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari Frontend
app.use(express.json()); // Memungkinkan server membaca input format JSON

// --- TAMBAHKAN KODE INI ---
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 
// -------------------------

// Route dasar untuk memastikan server hidup
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API AutoCare System!' });
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});
