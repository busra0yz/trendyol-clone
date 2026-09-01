const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class CartItem extends Model { }

CartItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'carts',
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
}, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
});

module.exports = CartItem;