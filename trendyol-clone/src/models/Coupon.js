const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Coupon extends Model { }

Coupon.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    minOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    maxUses: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
});

module.exports = Coupon;
