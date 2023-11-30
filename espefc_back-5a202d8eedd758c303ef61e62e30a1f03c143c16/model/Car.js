const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const Car = sequelize.define('cars', {
    car_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    car_title: DataTypes.STRING,
    car_content: DataTypes.STRING,
    car_phrase: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = Car;