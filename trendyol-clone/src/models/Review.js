const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Review extends Model { }

Review.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id',
        },
        allowNull: false,
    },


    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { // validate: Sequelize'in yerleşik doğrulama sistemi.
            min: 1,
            max: 5,
        },
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    //Kullanıcı ürünü satın almış mı?
    isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

}, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
});

/*
// Hook nedir?
   Sequelize'de hook'lar, belirli olaylar gerçekleştiğinde
   otomatik çalışan fonksiyonlardır. Bir nevi "tetikleyici"dir.
*/

//Review.create() metodu ile yeni bir yorum oluşturulduğunda, veritabanına kayıt EDİLDİKTEN SONRA bu fonksiyon otomatik çalışır.
Review.afterCreate(async (review) => { //review: Az önce oluşturulan yeni Review kaydıdır. Örn: { id: 50, userId: 3, productId: 42, rating: 5, ... }

    // Product modelini burada require ediyoruz (dosyanın en üstünde değil).
    // Sebep: "Circular Dependency" (döngüsel bağımlılık) hatası oluşmasın.
    // Product → Review'a, Review → Product'a bağlı olduğu için
    // ikisi birbirini en üstte require ederse sonsuz döngü oluşur.
    const Product = require('./Product');

    // findAll: Koşula uyan TÜM kayıtları dizi olarak döndürür.
    // where: SQL'deki WHERE ile aynı — filtreleme yapar.

    const allReviews = await Review.findAll({
        where: { productId: review.productId },
    });

    const reviewCount = allReviews.length;

    let totalRating = 0;
    for (const r of allReviews) {
        totalRating += r.rating;
    }

    // .toFixed(1): Sonucu virgülden sonra 1 basamağa yuvarlar.

    const averageRating = (totalRating / reviewCount).toFixed(1);

    /* ── ADIM 5: Product tablosunu güncelle ──
    
       Product.update(ne_güncelle, hangi_kayıt)
       - İlk parametre: güncellenecek alanlar ve yeni değerleri
       - İkinci parametre: WHERE koşulu — hangi ürünü güncelle
    
       SQL karşılığı:
       UPDATE products SET rating = 4.0, reviewCount = 3 WHERE id = 42 */

    await Product.update(
        {
            rating: averageRating,
            reviewCount: reviewCount,
        },
        { where: { id: review.productId } }
    );
});

module.exports = Review;
