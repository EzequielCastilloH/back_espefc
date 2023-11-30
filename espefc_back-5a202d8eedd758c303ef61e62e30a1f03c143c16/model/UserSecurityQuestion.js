const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');
const Question = require('./Question');
const User = require('./User');

const UserSecurityQuestion = sequelize.define('user_security_questions', {
    user_security_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_answer: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

UserSecurityQuestion.belongsTo(User, {foreignKey: 'user_id'});
UserSecurityQuestion.belongsTo(Question, {foreignKey: 'question_id'});

module.exports = UserSecurityQuestion;