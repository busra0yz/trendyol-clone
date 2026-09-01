const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Favorite extends Model { }

Favorite.init({
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
}, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    timestamps: true,
    indexes: [ // aynı ürün birden fazla kez favorilere eklenmesin diye
        {
            unique: true,
            fields: ['userId', 'productId'], // bu ikisi birleşince unique olmalı. Yani bir kullanıcı aynı ürünü birden fazla kez favorilerine ekleyemez.
            name: 'unique_user_product_favorite', // index adı
        },
    ],
});

module.exports = Favorite;
