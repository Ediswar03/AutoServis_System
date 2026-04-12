// File: routes/api.js
const express = require('express');
const router = express.Router();

// Memanggil controller yang sudah kita buat
const { tambahPelanggan } = require('../controllers/PelangganController');

// Membuat Endpoint API (Method: POST, URL: /api/pelanggan)
router.post('/pelanggan', tambahPelanggan);

module.exports = router;
