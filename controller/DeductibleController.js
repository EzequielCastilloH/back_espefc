const Deductible = require('../model/deductible');

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
        const { deductible_number, deductible_type } = req.body;

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
        const { deductible_number, deductible_type } = req.body;

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