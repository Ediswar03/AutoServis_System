module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MasterJasa', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_jasa: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  }, {
    tableName: 'master_jasa',
    timestamps: false,
  });
};
