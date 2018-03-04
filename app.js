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
appRoutes = require('./routes/app');
userRoutes = require('./routes/user');
loginRoutes = require('./routes/login');



// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Database working successfully')

})

//Rutas
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Listening express 
app.listen(3000, () => {
    console.log('Express Server listening in Port 3000')
})
