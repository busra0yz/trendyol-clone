require('dotenv').config(); //.env ayarlarını okuyabiliyoruz.

//Single Responsibility Principle sebepli diğer paketleri (express, bcrypt, jwt, cors, helmet, morgan, path, sequelize) buraya import etmedik.

const { Sequelize } = require('sequelize'); //Sequelize, ORM kütüphanesini import ederek veritabanı bağlantısını kuruyoruz.

//Hem ORM hemde manuel pool kullanılmaz. Zaten ORM arkada pool kullanıyor.

const sequelize = new Sequelize(
    process.env.DB_NAME,       //process.env. yapısı, kullanma sebebi .env dosyasından güvenli bir şekilde veri çekmek.
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        pool: {
            max: 5,        // Maksimum açık bağlantı sayısı
            min: 0,        // Minimum bağlantı sayısı
            acquire: 30000,// Bağlantı kurmak için beklenecek maks süre
            idle: 10000    // Boştaki işlem yapmayan bağlantının kapanma süresi
        },
        logging: false     // (Opsiyonel) Konsola her SQL query'yi yazdırmasını kapatır, terminal temiz kalır.
    }
);

// Bağlantıyı test eden fonksiyon
async function connectDB() {
    try {
        await sequelize.authenticate(); //sequelize kütüphanesinin veritabanı bağlantısını test eden fonksiyonu.
        console.log('✅ Veritabanı bağlantısı başarılı! Sequelize aktif.');
    } catch (err) {
        console.error('❌ Veritabanı bağlantısı başarısız:', err);
    }
}

//sequelize ve connectDB fonksiyonlarını export ediyoruz.Çünkü diğer dosyalarda çağıracağız.
module.exports = {
    sequelize,
    connectDB
};
