const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class ProductVariant extends Model { }

ProductVariant.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id',
        }
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    priceModifier: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variants',
    timestamps: true,
});

module.exports = ProductVariant;