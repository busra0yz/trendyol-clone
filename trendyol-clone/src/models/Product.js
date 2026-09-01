const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Product extends Model { }

Product.init({
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
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        }
    },
    brandId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'brands',
            key: 'id',
        }
    },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

    //Virtual Field: Veritabanında olmayan ama model üzerinden erişilebilen alanlar.
    //Sebep ise veritabanında her seferinde hesaplama yapmamak için.

    discountPercentage: { //Bu aslında property'dir.Kullanılırken şu şekilde kullanılır: product.discountPercentage
        type: DataTypes.VIRTUAL,
        get() { //discountPercentage'i kullanırken bu fonksiyon çalışır.Yani bir nevi hesaplayıcıdır.

            // Veritabanından asıl fiyatı ve indirimli fiyatı alıyoruz
            const price = this.getDataValue('price');
            const discountPrice = this.getDataValue('discountPrice');

            // Eğer indirimli fiyat yoksa veya geçerli değilse oran %0'dır
            if (!discountPrice || discountPrice >= price) return 0;

            // İndirim Oranı Formülü: ((İlk Fiyat - İndirimli Fiyat) / İlk Fiyat) * 100
            const percentage = ((price - discountPrice) / price) * 100;

            // Yuvarlayarak (Örn: 15.6 -> %16) döndürüyoruz
            return Math.round(percentage);
        }
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
});

module.exports = Product;