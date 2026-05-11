require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// Try undefined if empty
const password = DB_PASSWORD === '' ? undefined : DB_PASSWORD;

console.log(`Attempting to connect to:
  Database: ${DB_NAME}
  User: ${DB_USER}
  Host: ${DB_HOST}
  Port: ${DB_PORT}
  Password Type: ${typeof password}
`);

const sequelize = new Sequelize(DB_NAME, DB_USER, password, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: console.log,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully to ' + DB_NAME);
        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        if (error.original) {
            console.error('Original error code:', error.original.code);
        }
        process.exit(1);
    }
})();
