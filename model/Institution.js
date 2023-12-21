const {DataTypes} = require('sequelize');
const sequelize = require('../database/dbController');

const Institution = sequelize.define('institutions', {
    institution_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    institution_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = Institution;