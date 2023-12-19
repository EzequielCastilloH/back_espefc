const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/ApiRoutes');
const sequelize = require('./database/dbController');
const port = 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb',extended: true }));

app.use('/api', apiRoutes);
sequelize.sync();
// Ruta de inicio
//app.use(cors());

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});