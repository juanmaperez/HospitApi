// Requires libraries
const express = require('express');
const mongoose = require('mongoose');


// initialize variables
const app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Mongo Database working successfully')

})

//Rutas
app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok: true,
        message: 'Request done correctly'
    })
})

// Listening express 
app.listen(3000, () => {
    console.log('Express Server listening in Port 3000')
})
