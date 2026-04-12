const db = require('../config/db');

class Pelanggan {
    // Memasukkan data ke dalam MySQL
    static async create(dataPenerimaan) {
        const { nama_pelanggan, no_telepon, alamat } = dataPenerimaan;
        
        // Penulisan parameter secara '?' mengelakkan serangan SQL Injection
        const sql = `INSERT INTO pelanggan (nama_pelanggan, no_telepon, alamat) VALUES (?, ?, ?)`;
        const params = [nama_pelanggan, no_telepon, alamat];
        
        const [result] = await db.query(sql, params);
        return result;
    }
}

module.exports = Pelanggan;
