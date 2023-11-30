const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('pruebabasededatos','root','root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
});

// Verificar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = sequelize;