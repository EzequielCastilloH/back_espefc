const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'pruebafondoespe@gmail.com',
    pass: 'ixbxsltpjulkvjyy'
  }
});

transporter.verify().then( () => {
    console.log("Listo para mandar emails");
});

module.exports = transporter;