const Question = require('../model/Question');
const User = require('../model/User');

async function getAllQuestions(req, res){
    const questions = await Question.findAll();
    res.json(questions);
}

module.exports = { getAllQuestions };