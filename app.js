// Requires libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// initialize variables
const app = express();

// Body Parser configuration
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Require routes 
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const loginRoutes = require('./routes/login');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Database working successfully')

})

//Rutas
app.use('/users', userRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Listening express 
app.listen(3000, () => {
    console.log('Express Server listening in Port 3000')
})
