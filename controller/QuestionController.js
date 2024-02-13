const Question = require('../model/Question');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

async function getAllQuestions(req, res){
    try{
        const questions = await Question.findAll();
        res.status(200).json({ success: true, questions });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener las preguntas' });
    }
}

module.exports = { getAllQuestions };