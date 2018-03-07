const express = require('express')
const uploadRouter = express();

const fileUpload = require('express-fileupload');
const fs = require('fs');

//models
const User = require('../models/user');
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')


uploadRouter.use(fileUpload());


uploadRouter.put('/:collection/:id', (req, res, next)=>{

    const collection = req.params.collection;
    const id = req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok:false,
            message: 'Not file found',
        })
    }

    const file = req.files.image;
    let filename = file.name.split('.');
    const format = filename[filename.length -1];

    const extensionsAllowed = ['png', 'jpg', 'gif', 'jpeg'];
    const collectionsAllowed = ['doctors', 'hospitals', 'users'];

    if( extensionsAllowed.indexOf(format) < 0){
        return res.status(400).json({
            ok:false,
            message: 'Format not allowed',
        });
    };

    if( collectionsAllowed.indexOf(collection) < 0){
        return res.status(400).json({
            ok:false,
            message: 'Type of element not allowed',
        });
    };

    // customize filename
    const customFilename = `${id}-${new Date().getMilliseconds()}.${format}`;
    // create path
    const path = `./uploads/${collection}/${customFilename}`;

    file.mv(path, (err)=>{
        if (err){
            res.status(500).json({
                ok: false,
                message: 'Error uploading file'
            });
        };

        uploadByCollection(collection, id, customFilename, res)
       
        // res.status(200).json({
        //     ok: true,
        //     message: 'File uploaded'
        // });
    });
})


function uploadByCollection(collection, id, filename, response) {
    switch(collection){
        case 'users': User.findById(id, (err, user)=>{
            const oldPath = `uploads/users/${user.img}`; 
            if ( fs.existsSync(oldPath) ) {
                fs.unlink(oldPath)
            }
            user.img = filename;

            user.save((err, newUser)=>{
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded',
                    user: newUser
                });
            })
        });
        break;
        case 'hospitals':Hospital.findById(id, (err, hospital)=>{
            const oldPath = `uploads/hospitals/${hospital.img}`; 
            if ( fs.existsSync(oldPath) ) {
                fs.unlink(oldPath)
            }

            hospital.img = filename;
            hospital.save((err, newHospital)=>{
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded',
                    user: newHospital
                });
            })
        });
        break;
        case 'doctors':Doctor.findById(id, (err, doctor)=>{
            const oldPath = `uploads/doctors/${doctor.img}`; 
            if ( fs.existsSync(oldPath) ) {
                fs.unlink(oldPath)
            }
            doctor.img = filename;

            doctor.save((err, newDoctor)=>{
                newDoctor.password == 'Not Displayed';
                
                return res.status(200).json({
                    ok: true,
                    message: 'File uploaded',
                    user: newDoctor
                });
            })
        });
        break;
    }

}

module.exports = uploadRouter;