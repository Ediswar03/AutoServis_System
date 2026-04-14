module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SpkDetail', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    spk_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sparepart_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'spk_detail',
    timestamps: false,
  });
};
