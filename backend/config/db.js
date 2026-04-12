// File: config/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Memuat variabel dari file .env

// Membuat pool koneksi database
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Mengetes koneksi
dbPool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Koneksi Database Gagal:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke Database MySQL AutoCare!');
        connection.release();
    }
});

// Mengekspor koneksi agar bisa digunakan oleh file lain berbasis Promise
module.exports = dbPool.promise();
