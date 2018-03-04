
const express = require('express')

const SECRET = require('../config/config').Secret;


// Middleware for verify token
exports.verifyToken = function (req, res, nex){
    
    const token = req.query.token;

    jwt.verify(token, SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                message: 'Unauthorized. Token not valid',
                errors: err
            })
        }

        // Decoded return data about the user who made the request
        // and we could use it to verify other things or know who created, deleted or updated whatever.
        req.user = decoded.user;

        return next();
    })
}