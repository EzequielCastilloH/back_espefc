const Education = require('../model/education');
const jwt = require('jsonwebtoken');

async function createEducation(req, res) {
    try {
        const { education_videoId, authorization } = req.body;
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

        await Education.create({
            education_videoId
        });

        res.status(201).json({ message: 'Educacion guardada', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar la educacion' });
    }
}

async function getEducations(req, res) {
    try {
        const educations = await Education.findAll();
        res.status(200).json({ success: true, educations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener las educaciones' });
    }
}

async function getEducationById(req, res) {
    try {
        const { education_id, authorization } = req.body;
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
        const educations = await Education.findOne({ where: { education_id: education_id } });
        res.status(200).json({ success: true, educations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener la educacion' });
    }
}

async function updateEducation(req, res) {
    try {
        const { education_id, education_videoId, authorization } = req.body;
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

        const educations = await Education.findOne({ where: { education_id: education_id } });

        if (!educations) {
            return res.status(404).json({ success: false, message: 'Educacion no encontrada' });
        }

        educations.education_videoId = education_videoId;

        await educations.save();

        res.status(200).json({ success: true, message: 'Educacion actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar la educacion' });
    }
}

module.exports = { createEducation, getEducations, getEducationById, updateEducation };