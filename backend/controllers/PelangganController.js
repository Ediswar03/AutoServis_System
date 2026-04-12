// File: controllers/PelangganController.js
const db = require('../config/db'); // Memanggil koneksi database

const tambahPelanggan = async (req, res) => {
    try {
        // Menangkap data yang dikirim dari Frontend (Postman/React)
        const { nama_pelanggan, no_telepon, alamat } = req.body;

        // Validasi sederhana
        if (!nama_pelanggan || !no_telepon) {
            return res.status(400).json({ 
                status: false, 
                message: "Nama pelanggan dan nomor telepon wajib diisi!" 
            });
        }

        // Query SQL untuk memasukkan data
        const sqlQuery = 'INSERT INTO pelanggan (nama_pelanggan, no_telepon, alamat) VALUES (?, ?, ?)';
        
        // Mengeksekusi query (tanda '?' berguna untuk mencegah SQL Injection)
        const [result] = await db.query(sqlQuery, [nama_pelanggan, no_telepon, alamat]);

        // Mengirimkan respon berhasil
        res.status(201).json({
            status: true,
            message: "Data pelanggan berhasil disimpan!",
            data: {
                id_pelanggan: result.insertId,
                nama_pelanggan,
                no_telepon,
                alamat
            }
        });

    } catch (error) {
        console.error("Error Tambah Pelanggan:", error);
        res.status(500).json({ 
            status: false, 
            message: "Terjadi kesalahan pada server." 
        });
    }
};

// Mengekspor fungsi agar bisa digunakan di file Route
module.exports = {
    tambahPelanggan
};
