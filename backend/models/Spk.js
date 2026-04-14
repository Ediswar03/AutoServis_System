module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Spk', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_spk: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    pelanggan_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'OPEN',
      allowNull: false,
    },
    total_jasa: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    total_sparepart: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    total_tagihan: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'spk',
    timestamps: false,
  });
};
