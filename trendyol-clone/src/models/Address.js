const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Address extends Model { }

Address.init({
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Örn: ev, iş',
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
});

module.exports = Address;
