const express = require('express')

const loginRouter = express();
const User = require('../models/user');

// Bcrypt for passwords
const bcrypt = require('bcryptjs');
const salt = 10;

//config info
const SECRET = require('../config/config').Secret;

const jwt = require('jsonwebtoken');

loginRouter.post('/', (req, res)=>{
    
    const body = req.body;

    User.findOne({email: body.email}, (err, user)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error getting user',
                errors: err,
            })
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                message: 'Email or password incorrects email',
                errors: err
            })
        }

        if( !bcrypt.compareSync(body.password, user.password) ){
            return res.status(400).json({
                ok: false,
                message: 'Email or password incorrects pass',
                errors: err
            })
        }

        user.password = 'Not displayed';
        // Creating token
        const token = jwt.sign({ user: user}, SECRET, {expiresIn: 14400}); // 4 horas

        return res.status(200).json({
            ok: true,
            token: token,
            user: user
        })
    })
    
  
})



module.exports = loginRouter;
