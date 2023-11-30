const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const Question = sequelize.define('questions', {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    question_description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = Question;