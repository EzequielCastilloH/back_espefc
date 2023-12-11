const User = require('../model/User');
const Customer = require('../model/Customer');
const UserSecurityQuestion = require('../model/UserSecurityQuestion');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/encription');
const transporter = require('../utils/mailer');

async function createUserWithCustomer(req, res){
    try{
        const { user_ci, 
            customer_name, 
            customer_personal_email, 
            customer_espe_email, 
            customer_phone, 
            customer_direction, 
            security_questions,
             } = req.body;

        const userExists = await isUserAlreadyExist(user_ci);

        if (userExists) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe.' });
        }

        const customer_personal_email_encripted = encrypt(customer_personal_email);
        const customer_espe_email_encripted = encrypt(customer_espe_email);
        const customer_phone_encripted = encrypt(customer_phone);
        const customer_direction_encripted = encrypt(customer_direction);

        const newCustomer = await Customer.create({
            customer_name,
            customer_personal_email: customer_personal_email_encripted,
            customer_espe_email: customer_espe_email_encripted,
            customer_phone: customer_phone_encripted,
            customer_direction: customer_direction_encripted,
        });

        await newCustomer.reload();

        const newUser = await User.create({
            user_ci,
            customer_id: newCustomer.customer_id,
        });

        await newUser.reload();

        const userSecurityQuestions = security_questions.map(question => ({
            user_id: newUser.user_id,
            question_id: question.question_id,
            user_answer: encrypt(question.user_answer),
        }));

        const newUserSecurityQuestions = await UserSecurityQuestion.bulkCreate(userSecurityQuestions);

        await transporter.sendMail({
            from: '"Bienvenido al Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>', // sender address
            to: customer_personal_email + ", " + customer_espe_email, // list of receivers
            subject: "Gracias por registrarte - Fondo de Cesantía ESPE", // Subject line
            html: `
            <b> Gracias por registrarte en el Fondo de Cesantia ESPE </b>
            <a> Tu usuario es ${newUser.user_ci} </a>
            <br><br>
            <a> Tu contraseña es ${decrypt(newUser.user_password)} </a>
            `
        });

        res.status(201).json({ success: true, user: newUser, customer: newCustomer, security_questions: newUserSecurityQuestions });
    }catch (error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear el usuario y cliente. '+ error });
    }
}

async function getUserById(req, res){
    try{
        const { customer_id } = req.body;
        const user = await User.findOne({ where: { user_id: customer_id } });

        if(!user){
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.status(200).json({ success: true, user: user });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al obtener el usuario '+ error });
    }
}

async function getApprovedUsers(req, res){
    try{
        const users = await User.findAll( { where : { user_state: 1, user_role: 'usuario' } });
        const userIds = users.map(user => user.user_id);

        const customer = await Customer.findAll( { where : { customer_id: userIds } });
        const decryptedCustomers = customer.map(customer => ({
            customer_id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_personal_email: decrypt(customer.customer_personal_email),
            customer_espe_email: decrypt(customer.customer_espe_email),
            customer_phone: decrypt(customer.customer_phone),
            customer_direction: decrypt(customer.customer_direction),
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        }));
        res.json(decryptedCustomers);
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al cargar el usuario y cliente. '+ error });
    }
}

async function getPendingUsers(req, res){
    try{
        const users = await User.findAll( { where : { user_state: 0, user_role: 'usuario' } });
        const userIds = users.map(user => user.user_id);

        const customer = await Customer.findAll( { where : { customer_id: userIds } });
        const decryptedCustomers = customer.map(customer => ({
            customer_id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_personal_email: decrypt(customer.customer_personal_email),
            customer_espe_email: decrypt(customer.customer_espe_email),
            customer_phone: decrypt(customer.customer_phone),
            customer_direction: decrypt(customer.customer_direction),
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        }));
        res.json(decryptedCustomers);
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al cargar el usuario y cliente. '+ error });
    }
}

async function setUserAvalible(req, res){
    try{
        const { user_id } = req.body;
        const user = await User.findOne({ where: { user_id: user_id } });
        
        if(!user){
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const customer = await Customer.findOne({ where: { customer_id: user_id } });
        await transporter.sendMail({
            from: '"Aprobación de cuenta - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>', 
            to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email), 
            subject: "Aprobación de cuenta - Fondo de Cesantía ESPE",
            html: `
            <b> Felicitaciones, ahora eres parte oficialmente del Fondo de Cesantía ESPE </b>
            <br><br>
            <p>Ingresa a nuestra plataforma y revisa las diferentes funcionalidades disponibles para ti </p>
            `
        });
        user.user_state = 1;
        await user.save();

        res.status(200).json({ success: true, customer: user, message: 'Usuario habilitado'});
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al habilitar el usuario '+ error });
    }
}

async function setUserDisable(req, res){
    try{
        const { user_id } = req.body;
        const user = await User.findOne({ where: { user_id: user_id } });
        
        if(!user){
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const customer = await Customer.findOne({ where: { customer_id: user_id } });
        await transporter.sendMail({
            from: '"Desactivación de cuenta - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>', 
            to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email), 
            subject: "Cuenta desactivada - Fondo de Cesantía ESPE",
            html: `
            <b> Tu cuenta ha sido desactivada. Lamentamos que ya no formes parte del Fondo de Cesantía ESPE </b>
            <br><br>
            <p>Si tienes alguna duda, por favor contacta con cualquiera de nuestros trabajadores</p>
            `
        });

        user.user_state = 0;
        await user.save();

        res.status(200).json({ success: true, customer: user, message: 'Usuario deshabilitado' });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al deshabilitar el usuario '+ error });
    }
}

async function loginUser(req, res){
    const { user_ci, user_password } = req.body;
    const userExist = await isUserAlreadyExist(user_ci);
    if(userExist){
        const user = await User.findOne( { where: { user_ci: user_ci } });
        const customer = await Customer.findOne( { where: { customer_id: user.customer_id } });
        const newCustomer = {
            customer_id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_personal_email: decrypt(customer.customer_personal_email),
            customer_espe_email: decrypt(customer.customer_espe_email),
            customer_phone: decrypt(customer.customer_phone),
            customer_direction: decrypt(customer.customer_direction),
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
        }
        if(decrypt(user.user_password) === user_password){
            const code = generateSixDigitCode();
            await transporter.sendMail({
                from: '"Código de verificación - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>', 
                to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email), 
                subject: "Verificación de inicio de sesión - Fondo de Cesantía ESPE ",
                html: `
                <b> Aquí está tu código de verificación para el fondo de cesantia ESPE </b>
                <br><br>
                <a> ${code} </a>
                `
            });
            res.status(200).json({ success: true, user: user, customer: newCustomer, code, message: 'Inicio de sesión exitoso' });
        }else{
            res.status(404).json({ success: false, error: user_password, message: 'Contraseña inválida' });
        }
        
    }else{
        res.status(404).json({ success: false, error: user_ci, message: 'Usuario no encontrado' });
    }
}

async function changePassword(req, res){
    try{
        const { user_ci, user_password, user_new_password } = req.body;
        const user = await User.findOne({ where: { user_ci: user_ci } });
        
        if(!user){
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if(decrypt(user.user_password) === user_password){
            user.user_password = encrypt(user_new_password);
            await user.save();
            res.status(200).json({ success: true, customer: user, message: 'Contraseña cambiada' });
        }else{
            res.status(404).json({ success: false, message: 'Contraseña inválida' });
        }
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al cambiar la contraseña '+ error });
    }
}

async function editUser(req, res){
    try{
        const { user_ci, 
            customer_personal_email, 
            customer_phone, 
            customer_direction,
             } = req.body;

        const user = await User.findOne({ where: { user_ci: user_ci } });
        
        if(!user){
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const customer = await Customer.findOne({ where: { customer_id: user.customer_id } });

        customer.customer_personal_email = encrypt(customer_personal_email);
        customer.customer_phone = encrypt(customer_phone);
        customer.customer_direction = encrypt(customer_direction);

        await customer.save();

        await transporter.sendMail({
            from: '"Actualización de datos - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>', // sender address
            to: customer_personal_email + ", " + customer.customer_espe_email, // list of receivers
            subject: "Actualización de datos - Fondo de Cesantía ESPE", // Subject line
            html: `
            <b> Se han actualizado con éxito los detalles de tu perfil en el Fondo de Cesantía ESPE. </b>
            <br><br>
            <a> Gracias por mantener tus datos actualizados. Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros. </a>
            <br><br>
            `
        });
        return res.status(200).json({ success: true, customer: user, message: 'Usuario actualizado' });

    }catch(error){
        return res.status(500).json({ success: false, message: 'Error al editar el usuario. '+ error });
    }
}

async function sendSuggestion(req, res){
    try{
        const { suggestion } = req.body;

        await transporter.sendMail({
            from: '"Sugerencia - Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>',
            to: "jnmolina@espe.edu.ec",
            subject: "Sugerencia - Fondo de Cesantía ESPE",
            html: `
            <br><br>
            <a>De: ${suggestion.name} </a>
            <a>Con correo: ${suggestion.mail} </a>
            <a>Teléfono: ${suggestion.cellphone} </a>
            <a>Sugerencia/Mensaje: ${suggestion.message} </a>
            <br><br>
            `
        });
        return res.status(200).json({ success: true, message: 'Sugerencia enviada' });

    }catch(error){
        return res.status(500).json({ success: false, message: 'Error al enviar sugerencia. '+ error });
    }
}

async function isUserAlreadyExist(user_ci){
    try{
        const user = await User.findOne({ where: { user_ci: user_ci } });
        return !!user;
    }catch(error){
        res.status(500).json({ success: false, message: 'Error al verificar el usuario '+ error });
    }
}

function generateSixDigitCode() {
    // Generar un número aleatorio de 6 dígitos
    const randomCode = crypto.randomBytes(3).readUIntBE(0, 3) % 1000000;

    // Formatear el código para asegurar que tenga siempre 6 dígitos
    const formattedCode = String(randomCode).padStart(6, '0');

    return formattedCode;
}

module.exports = { createUserWithCustomer, getPendingUsers, setUserAvalible, setUserDisable, loginUser, editUser, changePassword, getApprovedUsers, sendSuggestion, getUserById };