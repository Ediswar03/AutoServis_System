const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const MasterJasa = require('./MasterJasa')(sequelize, DataTypes);
const Inventory = require('./Inventory')(sequelize, DataTypes);
const Spk = require('./Spk')(sequelize, DataTypes);
const SpkDetail = require('./SpkDetail')(sequelize, DataTypes);

Spk.hasMany(SpkDetail, { foreignKey: 'spk_id', as: 'details' });
SpkDetail.belongsTo(Spk, { foreignKey: 'spk_id', as: 'spk' });
SpkDetail.belongsTo(Inventory, { foreignKey: 'sparepart_id', as: 'sparepart' });
SpkDetail.belongsTo(MasterJasa, { foreignKey: 'service_id', as: 'service' });

module.exports = {
  sequelize,
  Sequelize,
  MasterJasa,
  Inventory,
  Spk,
  SpkDetail,
};
