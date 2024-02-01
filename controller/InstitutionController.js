const Institution = require('../model/Institution');

async function createInstitution(req, res) {
    try {
        const { institution_name, authorization } = req.body;
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
        await Institution.create({
            institution_name
        });
        res.status(201).json({
            message: 'Institution guardado',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el Institution'
        });
    }
}

async function getInstitutions(req, res) {
    try {
        const { authorization } = req.body;
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
        const institutions = await Institution.findAll();
        res.status(200).json({
            success: true,
            institutions: institutions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los Institutions'
        });
    }
}

async function updateInstitution(req, res) {
    try {
        const {
            institution_id,
            institution_name,
            authorization
        } = req.body;
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
        
        const institution = await Institution.findOne({ where: { institution_id: institution_id } });

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: 'Institution no encontrado'
            });
        }

        institution.institution_name = institution_name;
        await institution.save();

        res.status(201).json({
            message: 'Institution actualizado',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el Institution'
        });
    }
}

async function deleteInstitution(req, res) {
    try {
        const {
            institution_id,
            authorization
        } = req.body;
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

        const institution = await Institution.findOne({ where: { institution_id: institution_id } });

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: 'Institution no encontrado'
            });
        }

        await institution.destroy();

        res.status(201).json({
            message: 'Institution eliminado',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el Institution'
        });
    }
}

module.exports = { createInstitution, getInstitutions, updateInstitution, deleteInstitution};