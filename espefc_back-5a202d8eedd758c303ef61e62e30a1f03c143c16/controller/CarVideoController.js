const CarVideo = require('../model/CarVideo');

async function createCarVideo(req, res) {
    try {
        const { car_videoId, car_video_name, car_video_year, car_video_km, car_video_price, car_video_href, brand_id } = req.body;

        await CarVideo.create({
            car_videoId,
            car_video_name,
            car_video_year,
            car_video_km,
            car_video_price,
            car_video_href,
            brand_id
        });

        res.status(201).json({ message: 'Carro guardado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el carro' });
    }
}

async function getCarVideos(req, res) {
    try {
        const car_videos = await CarVideo.findAll();
        res.status(200).json({ car_videos }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los carros' });
    }
}

async function getCarVideoById(req, res) {
    try {
        const { car_video_id } = req.body;
        const car_videos = await CarVideo.findOne({ where: { car_video_id: car_video_id } });
        res.status(200).json({ car_videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carro' });
    }
}

async function updateCarVideo(req, res) {
    try {
        const { car_video_id, car_video_name, car_video_year, car_video_km, car_video_price, car_video_href, brand_id } = req.body;

        const car_videos = await CarVideo.findOne({ where: { car_video_id: car_video_id } });

        if (!car_videos) {
            return res.status(404).json({ message: 'Carro no encontrado' });
        }

        car_videos.car_video_name = car_video_name;
        car_videos.car_video_year = car_video_year;
        car_videos.car_video_km = car_video_km;
        car_videos.car_video_price = car_video_price;
        car_videos.car_video_href = car_video_href;
        car_videos.brand_id = brand_id;

        await car_videos.save();

        res.status(201).json({ message: 'Carro actualizado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el carro' });
    }
}

module.exports = { createCarVideo, getCarVideos, getCarVideoById, updateCarVideo };