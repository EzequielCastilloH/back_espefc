const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const New = sequelize.define('news', {
    new_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    new_title: DataTypes.STRING,
    new_content: DataTypes.STRING,
    new_phrase: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = New;