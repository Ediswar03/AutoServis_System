const { sequelize, Spk, SpkDetail, Inventory, MasterJasa } = require('../models');

const CRITICAL_STOCK_THRESHOLD = 5;

const completeSpk = async (req, res) => {
  const { spkId } = req.body;

  if (!spkId) {
    return res.status(400).json({
      status: false,
      message: 'spkId wajib disertakan pada body request.',
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const spk = await Spk.findOne({
      where: { id: spkId },
      include: [
        {
          model: SpkDetail,
          as: 'details',
          include: [
            { model: Inventory, as: 'sparepart' },
            { model: MasterJasa, as: 'service' },
          ],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!spk) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: `SPK dengan id ${spkId} tidak ditemukan.`,
      });
    }

    if (spk.status === 'COMPLETED') {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: 'SPK sudah diselesaikan sebelumnya.',
      });
    }

    if (!spk.details || spk.details.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: 'SPK tidak memiliki item sparepart atau jasa untuk dihitung.',
      });
    }

    let totalSparepart = 0;
    let totalJasa = 0;
    const criticalWarnings = [];

    for (const item of spk.details) {
      const sparepart = item.sparepart;
      const service = item.service;
      const quantity = Number(item.quantity || 0);

      if (!sparepart) {
        throw new Error(`Detail SPK id ${item.id} tidak punya data sparepart.`);
      }

      if (!service) {
        throw new Error(`Detail SPK id ${item.id} tidak punya data jasa.`);
      }

      if (quantity <= 0) {
        throw new Error(`Kuantaity untuk sparepart ${sparepart.nama_sparepart} harus lebih dari 0.`);
      }

      if (Number(sparepart.stok) < quantity) {
        throw new Error(`Stok untuk ${sparepart.nama_sparepart} tidak cukup. Tersedia: ${sparepart.stok}.`);
      }

      const newStock = Number(sparepart.stok) - quantity;
      await Inventory.update(
        { stok: newStock },
        { where: { id: sparepart.id }, transaction }
      );

      totalSparepart += Number(sparepart.harga) * quantity;
      totalJasa += Number(service.harga);

      if (newStock < CRITICAL_STOCK_THRESHOLD) {
        criticalWarnings.push({
          sparepart_id: sparepart.id,
          nama_sparepart: sparepart.nama_sparepart,
          stok_sisa: newStock,
          message: 'Stok berada di bawah batas kritis.',
        });
      }
    }

    const totalTagihan = totalSparepart + totalJasa;

    await spk.update(
      {
        total_sparepart: totalSparepart,
        total_jasa: totalJasa,
        total_tagihan: totalTagihan,
        status: 'COMPLETED',
        completed_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      status: true,
      message: 'SPK berhasil diselesaikan.',
      data: {
        spk_id: spk.id,
        total_sparepart: totalSparepart,
        total_jasa: totalJasa,
        total_tagihan: totalTagihan,
        warnings: criticalWarnings,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error complete SPK:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan saat menyelesaikan SPK. Transaksi dibatalkan.',
      error: error.message,
    });
  }
};

const getSpkById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      status: false,
      message: 'ID SPK harus berupa angka yang valid.',
    });
  }

  try {
    const spk = await Spk.findOne({
      where: { id: Number(id) },
      include: [
        {
          model: SpkDetail,
          as: 'details',
          include: [
            { model: Inventory, as: 'sparepart' },
            { model: MasterJasa, as: 'service' },
          ],
        },
      ],
    });

    if (!spk) {
      return res.status(404).json({
        status: false,
        message: `SPK dengan id ${id} tidak ditemukan.`,
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data SPK berhasil diambil.',
      data: spk,
    });
  } catch (error) {
    console.error('Error get SPK:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan saat mengambil data SPK.',
      error: error.message,
    });
  }
};

module.exports = {
  completeSpk,
  getSpkById,
};
