// File: routes/api.js
const express = require('express');
const router = express.Router();

const { tambahPelanggan } = require('../controllers/PelangganController');
const { completeSpk, getSpkById } = require('../controllers/SpkController');

router.post('/pelanggan', tambahPelanggan);
router.post('/spk/complete', completeSpk);
router.get('/spk/:id', getSpkById);

module.exports = router;
