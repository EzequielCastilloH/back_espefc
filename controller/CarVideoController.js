const CarVideo = require('../model/CarVideo');

async function createCarVideo(req, res) {
    try {
        const { car_videoId, car_video_name, car_video_year, car_video_km, car_video_price, car_video_href, car_video_brand, authorization } = req.body;

        let token = '';
        if(authorization && authorization.toLowerCase().startsWith('bearer')){
            token = authorization.substring(7);
        }
        let decodedToken = {};
        try{
            decodedToken = jwt.verify(token, "awd");
        }catch(error){
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }
        if(!token || !decodedToken.ci){
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }
        await CarVideo.create({
            car_videoId,
            car_video_name,
            car_video_year,
            car_video_km,
            car_video_price,
            car_video_href,
            car_video_brand
        });

        res.status(201).json({ message: 'Carro guardado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar el carro' });
    }
}

async function getCarVideos(req, res) {
    try {
        const car_videos = await CarVideo.findAll();
        res.status(200).json({ success: true, car_videos }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener los carros' });
    }
}

async function getCarVideoByBrand(req, res) {
    try {
        const car_videos = await CarVideo.findAll({ where: { car_video_brand: car_video_brand } });
        res.status(200).json({ success: true, car_videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el carro' });
    }
}

async function updateCarVideo(req, res) {
    try {
        const { car_video_id, car_videoId, car_video_name, car_video_year, car_video_km, car_video_price, car_video_href, car_video_brand, authorization } = req.body;
        let token = '';
        if(authorization && authorization.toLowerCase().startsWith('bearer')){
            token = authorization.substring(7);
        }
        let decodedToken = {};
        try{
            decodedToken = jwt.verify(token, "awd");
        }catch(error){
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }
        if(!token || !decodedToken.ci){
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }

        const car_videos = await CarVideo.findOne({ where: { car_video_id: car_video_id } });

        if (!car_videos) {
            return res.status(404).json({ message: 'Carro no encontrado' });
        }
        car_videoId.car_videoId = car_videoId;
        car_videos.car_video_name = car_video_name;
        car_videos.car_video_year = car_video_year;
        car_videos.car_video_km = car_video_km;
        car_videos.car_video_price = car_video_price;
        car_videos.car_video_href = car_video_href;
        car_videos.car_video_brand = car_video_brand;

        await car_videos.save();

        res.status(201).json({ message: 'Carro actualizado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el carro' });
    }
}

module.exports = { createCarVideo, getCarVideos, getCarVideoByBrand, updateCarVideo };