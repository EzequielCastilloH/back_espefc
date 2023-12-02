const Car = require('../model/Car');

async function createCar(req, res) {
    try {
        const { car_title, car_content, car_phrase } = req.body;

        await Car.create({
            car_title,
            car_content,
            car_phrase,
        });

        res.status(201).json({ message: 'Carro guardado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar el carro' });
    }
}

async function getCars(req, res) {
    try {
        const cars = await Car.findAll();
        res.status(200).json({ success: true, cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener las Carro' });
    }
}

async function getCarById(req, res) {
    try {
        const { car_id } = req.body;
        const cars = await Car.findOne({ where: { car_id: car_id } });
        res.status(200).json({ success: true, cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el carro' });
    }
}

async function updateCar(req, res) {
    try {
        const { car_id, car_title, car_content, car_phrase } = req.body;

        const cars = await Car.findOne({ where: { car_id: car_id } });

        if (!cars) {
            return res.status(404).json({ message: 'Noticia no encontrado' });
        }

        cars.car_title = car_title;
        cars.car_content = car_content;
        cars.car_phrase = car_phrase;

        await cars.save();

        res.status(201).json({ message: 'Carro actualizado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el carro' });
    }
}

module.exports = { createCar, getCars, getCarById, updateCar };