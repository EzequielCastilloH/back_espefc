const New = require('../model/New');
const jwt = require('jsonwebtoken');

async function createNew(req, res) {
    try {
        const { new_title, new_content, new_phrase, authorization } = req.body;
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

        await New.create({
            new_title,
            new_content,
            new_phrase,
        });

        res.status(201).json({ message: 'Noticia guardado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar la Noticia' });
    }
}

async function getNews(req, res) {
    try {
        const news = await New.findAll();
        res.status(200).json({ success: true, news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener las Noticias' });
    }
}

async function getNewById(req, res) {
    try {
        const { new_id, authorization } = req.body;
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
        const news = await New.findOne({ where: { new_id: new_id } });
        res.status(200).json({ success: true, news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener la Noticia' });
    }
}

async function updateNew(req, res) {
    try {
        const { new_id, new_title, new_content, new_phrase, authorization } = req.body;
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

        const news = await New.findOne({ where: { new_id: new_id } });

        if (!news) {
            return res.status(404).json({ success: false, message: 'Noticia no encontrado' });
        }

        news.new_title = new_title;
        news.new_content = new_content;
        news.new_phrase = new_phrase;

        await news.save();

        res.status(201).json({ message: 'Noticia actualizada', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar la Noticia' });
    }
}

module.exports = { createNew, getNews, getNewById, updateNew };