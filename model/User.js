const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../database/dbController');
const Customer = require('./Customer');
const { encrypt } = require('../utils/encription');

const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_ci: DataTypes.STRING,
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: encrypt(crypto.randomBytes(5).toString('hex')),
    },
    user_state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
    },
    user_balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'usuario',
    },
    user_first_time: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

User.belongsTo(Customer, {foreignKey: 'customer_id'});

module.exports = User;