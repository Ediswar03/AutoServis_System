module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_sparepart: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    harga: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  }, {
    tableName: 'inventory',
    timestamps: false,
  });
};
