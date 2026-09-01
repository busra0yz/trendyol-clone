const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class OrderItem extends Model { }

OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'orders',
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
    variantId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'product_variants',
            key: 'id',
        },
        allowNull: true,
        defaultValue: null,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    priceAtTime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Snapshot — ürün silinse bile isim kalır',
    },
}, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
});

module.exports = OrderItem;
