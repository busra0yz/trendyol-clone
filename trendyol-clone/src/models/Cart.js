const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Cart extends Model { }

Cart.init({
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
        unique: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
});

module.exports = Cart;