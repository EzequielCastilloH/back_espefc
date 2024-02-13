const Deductible = require('../model/deductible');
const jwt = require('jsonwebtoken');

async function getDeductibles(req, res) {
    try {

        const deductibles = await Deductible.findAll();
        res.status(200).json({ success: true, deductible: deductibles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los deducibles' });
    }
}

async function editDeductibleByType(req, res) {
    try {
        const { deductible_number, deductible_type, authorization } = req.body;
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

        const deductible = await Deductible.findOne({ where: { deductible_type: deductible_type } });

        if (!deductible) {
            return res.status(404).json({ message: 'Deducible no encontrado' });
        }

        deductible.deductible_number = deductible_number;

        await deductible.save();
        res.status(200).json({ success: true, message: 'Deducible actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el deducible' });
    }
}

async function createDeductible(req, res) {
    try {
        const { deductible_number, deductible_type, authorization } = req.body;
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

        const deductible = await Deductible.create({
            deductible_number,
            deductible_type
        });

        res.status(200).json({ success: true, message: 'Deducible creado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el deducible' });
    }
}

module.exports = { getDeductibles, editDeductibleByType, createDeductible };