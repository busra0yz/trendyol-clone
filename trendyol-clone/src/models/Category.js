const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); //sequelize kütüphanesinden veritabanı bağlantısını buraya alıyoruz.

class Category extends Model { } // Category sınıfını Sequelize'in Model sınıfından miras alıyoruz.

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    parentId: {
        type: DataTypes.INTEGER,
        references: { // Self-referencing: Bir kategorinin kendi içinde alt kategorisi olabilir.
            model: 'categories', // Kendi tablosuna (self-reference) referans
            key: 'id',
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    // init fonksiyonunun 2. parametresi(Model ayarları)
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true
});


// 1. Bir kategorinin (ör: Elektronik) İÇERİSİNDE birden fazla ALT KATEGORİ (ör: Telefon, Bilgisayar) olabilir. (1 -> N)
Category.hasMany(Category, {
    as: 'subCategories', // Kod içinde çağırırken kullanılacak takma ad
    foreignKey: 'parentId' // Hangi sütun üzerinden bağlandığı
});

// 2. Bir alt kategorinin (ör: Telefon) SADECE BİR TANE ana kategorisi (ör: Elektronik) olabilir. (N -> 1)
Category.belongsTo(Category, {
    as: 'parentCategory',
    foreignKey: 'parentId'
});

module.exports = Category; 