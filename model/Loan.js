const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');
const User = require('./User');
const Customer = require('./Customer');

const Loan = sequelize.define('loans', {
    loan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    loan_customer_name: DataTypes.STRING,
    loan_type: DataTypes.STRING,
    loan_amount: DataTypes.FLOAT,
    loan_deadline: DataTypes.INTEGER,
    loan_amortization_type: DataTypes.STRING,
    loan_state:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pendiente',
    },
    loan_initial_amount: DataTypes.FLOAT,
    loan_guarantors: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

Loan.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

module.exports = Loan;
