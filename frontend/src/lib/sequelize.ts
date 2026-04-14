import { Sequelize } from 'sequelize';

const globalWithSequelize = globalThis as typeof globalThis & {
  __autoservisSequelize?: Sequelize;
};

const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || '';
const username = process.env.DB_USER || process.env.MYSQL_USER || '';
const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';

if (!database || !username || !password) {
  throw new Error('Environment variables DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD harus diatur.');
}

const sequelize =
  globalWithSequelize.__autoservisSequelize ??
  new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

globalWithSequelize.__autoservisSequelize = sequelize;

export { sequelize };
