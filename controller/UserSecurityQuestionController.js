const UserSecurityQuestion = require('../model/UserSecurityQuestion');
const User = require('../model/User');
const Customer = require('../model/Customer');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/encription');
const transporter = require('../utils/mailer');

async function getUserQuestions(req, res){
    try{
        const { user_ci } = req.body;
        const user = await User.findOne( { where: { user_ci: user_ci } } );
        const userQuestions = await UserSecurityQuestion.findAll({ where: { user_id: user.user_id } });
        const questions = userQuestions.map( userQuestions => ({
            question_id: userQuestions.question_id,
        }));
        res.json(questions);
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al cargar las preguntas del usuario. '+ error });
    }
}

async function getUserAnswers(req, res){
    try{
        const { user_ci, user_answers_body } = req.body;
        const user = await User.findOne( { where: { user_ci: user_ci } } );
        const customer = await Customer.findOne( { where: { customer_id: user.customer_id} } );
        const userQuestions = await UserSecurityQuestion.findAll({ where: { user_id: user.user_id } });
        const decryptedQuestions = userQuestions.map( userQuestions => ({
            question_id: userQuestions.question_id,
            user_answer: decrypt(userQuestions.user_answer),
        }));
        const securityAnswers = user_answers_body.map( user_answers_body => ({
            question_id: user_answers_body.question_id,
            user_answer: user_answers_body.user_answer,
        }));

        const sonIguales = decryptedQuestions.every((dq, index) => {
            const sa = securityAnswers[index];
            return dq.question_id === sa.question_id && dq.user_answer === sa.user_answer;
        });
    
        if (sonIguales) {
            const newPassword = encrypt(crypto.randomBytes(5).toString('hex'));
            user.user_password = newPassword;
            await user.save();
            console.log(decrypt(customer.customer_personal_email));
            await user.reload();
            await transporter.sendMail({
                from: '"Contraseña Nueva - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>',
                to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email),
                subject: "Contraseña provisional nueva - Fondo de Cesantía ESPE ",
                html: `
                <b> Esta es tu contraseña provisional para el Fondo de Cesantia ESPE </b>
                <br><br>
                <a> Tu contraseña es ${decrypt(user.user_password)} </a>
                `
            });

            res.json({ success: true, message: 'Las respuestas son iguales. Contraseña cambiada' });
        } else {
            res.json({ success: false, message: 'Las respuestas no son iguales.' });
        }
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al cargar las preguntas del usuario. '+ error });
    }
}

module.exports = { getUserQuestions, getUserAnswers };