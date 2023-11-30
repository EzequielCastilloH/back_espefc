const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbController');

const CarVideo = sequelize.define('car_videos', {
    car_video_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    car_videoId: DataTypes.STRING,
    car_video_name: DataTypes.STRING,
    car_video_year: DataTypes.STRING,
    car_video_km: DataTypes.FLOAT,
    car_video_price: DataTypes.FLOAT,
    car_video_href: DataTypes.STRING,
    car_video_brand: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});

module.exports = CarVideo;