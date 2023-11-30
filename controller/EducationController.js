const Education = require('../model/education');

async function createEducation(req, res) {
    try {
        const { education_videoId } = req.body;

        await Education.create({
            education_videoId
        });

        res.status(201).json({ message: 'Educacion guardada', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar la educacion' });
    }
}

async function getEducations(req, res) {
    try {
        const educations = await Education.findAll();
        res.status(200).json({ educations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las educaciones' });
    }
}

async function getEducationById(req, res) {
    try {
        const { education_id } = req.body;
        const educations = await Education.findOne({ where: { education_id: education_id } });
        res.status(200).json({ educations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la educacion' });
    }
}

async function updateEducation(req, res) {
    try {
        const { education_id, education_videoId } = req.body;

        const educations = await Education.findOne({ where: { education_id: education_id } });

        if (!educations) {
            return res.status(404).json({ message: 'Educacion no encontrada' });
        }

        educations.education_videoId = education_videoId;

        await educations.save();

        res.status(200).json({ message: 'Educacion actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la educacion' });
    }
}

module.exports = { createEducation, getEducations, getEducationById, updateEducation };