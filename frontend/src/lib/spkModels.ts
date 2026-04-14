import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from './sequelize';

const globalModels = globalThis as typeof globalThis & {
  __autoservisSpkModels?: {
    Spk: ReturnType<Sequelize['define']>;
    SpkDetail: ReturnType<Sequelize['define']>;
    Inventory: ReturnType<Sequelize['define']>;
    MasterJasa: ReturnType<Sequelize['define']>;
  };
};

if (!globalModels.__autoservisSpkModels) {
  const Inventory = sequelize.define(
    'Inventory',
    {
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
    },
    {
      tableName: 'inventory',
      timestamps: false,
    }
  );

  const MasterJasa = sequelize.define(
    'MasterJasa',
    {
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
    },
    {
      tableName: 'master_jasa',
      timestamps: false,
    }
  );

  const Spk = sequelize.define(
    'Spk',
    {
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
        allowNull: false,
        defaultValue: 'OPEN',
      },
      total_jasa: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_sparepart: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_tagihan: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'spk',
      timestamps: false,
    }
  );

  const SpkDetail = sequelize.define(
    'SpkDetail',
    {
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
    },
    {
      tableName: 'spk_detail',
      timestamps: false,
    }
  );

  Spk.hasMany(SpkDetail, { foreignKey: 'spk_id', as: 'details' });
  SpkDetail.belongsTo(Inventory, { foreignKey: 'sparepart_id', as: 'sparepart' });
  SpkDetail.belongsTo(MasterJasa, { foreignKey: 'service_id', as: 'service' });

  globalModels.__autoservisSpkModels = {
    Spk,
    SpkDetail,
    Inventory,
    MasterJasa,
  };
}

export const { Spk, SpkDetail, Inventory, MasterJasa } = globalModels.__autoservisSpkModels!;
