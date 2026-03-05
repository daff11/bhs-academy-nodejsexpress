// config/dbConfig.js
const { Sequelize } = require('sequelize');

// Konfigurasi database
const dbConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DB: 'bhs',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Inisialisasi Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
});

// Ekspor objek Sequelize
module.exports = sequelize; // Ekspor hanya instansi sequelize
