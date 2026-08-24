const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Brand extends Model { }

Brand.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
    },
    logoUrl: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: true,
})

module.exports = Brand;