require('dotenv').config();
const { Sequelize } = require('sequelize');

const useSSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || null,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        ...(useSSL && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        })
    }
);

module.exports = sequelize;
