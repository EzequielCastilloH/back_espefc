const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const Customer = sequelize.define('customers', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_name: DataTypes.STRING,
    customer_personal_email: DataTypes.STRING,
    customer_espe_email: DataTypes.STRING,
    customer_phone: DataTypes.STRING,
    customer_direction: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = Customer;