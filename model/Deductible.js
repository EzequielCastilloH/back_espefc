const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const Deductible = sequelize.define('deductibles', {
    deductible_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deductible_number: DataTypes.FLOAT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = Deductible;