require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('sequelize');
const express = require('express');
const app = express();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '[PASSWORD]',
    database: 'trendyol-clone',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const pool = mysql.createPool({
    host: process.env.DB_HOST, //.env dosyasından çekilecek değerler için "process.env" kullanılır.
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Aynı anda maksimum 10 aktif bağlantıya izin verilir.
    queueLimit: 0  // Bağlantı sırası sınırsızdır.
})

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Veritabanı bağlantısı başarılı');
    } catch (err) {
        console.log('Veritabanı bağlantısı başarısız', err);
    }
}
module.exports = {
    sequelize,
    pool
}
