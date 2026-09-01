const { Model, DataType } = require('sequelize');
const { sequelize } = require('../config/database');

class ProductImage extends Model { }

ProductImage.init({
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
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    altText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'product_images',
    timestamps: true,
});

module.exports = ProductImage;