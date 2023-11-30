const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const Education = sequelize.define('educations', {
    education_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    education_videoId: DataTypes.STRING
});

module.exports = Education;