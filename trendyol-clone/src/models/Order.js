const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Order extends Model { }

Order.init({
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
    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'addresses',
            key: 'id',
        },
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'refunded'),
        defaultValue: 'pending',
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
});

module.exports = Order;
