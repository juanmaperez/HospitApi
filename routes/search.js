const express = require('express')

const searchRouter = express();

const Hospital = require('../models/hospital')
const User = require('../models/user')
const Doctor = require('../models/doctor')

searchRouter.get('/collection/:collection/:query', (req, res, next)=>{

    const collection = String(req.params.collection).toLowerCase();
    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    let promise;

    switch(collection){
        case 'doctors': promise = searchDoctors(regex); break;
        case 'users': promise = searchUser(regex); break;
        case 'hospitals': promise = searchHospitals(regex); break;
        default:
            return res.status(400).json({
                ok: false,
                message: collection + ' dont match with collections',
            })
    }

    promise.then((response)=>{
        res.status(200).json({
            ok:true,
            [collection]: response,
           
        })
    })
    .catch((error)=>{
        res.status(500).json({
            ok:false,
            error: error
        })
    }) 
})

searchRouter.get('/all/:query', (req, res, next)=>{

    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    Promise.all([
        searchHospitals(regex),
        searchDoctors(regex),
        searchUser(regex)
    ]).then((response)=>{
        res.status(200).json({
            ok:true,
            hospitals: response[0],
            doctors: response[1],
            users: response[2]
        })
    })
    .catch((error)=>{
        res.status(500).json({
            ok:false,
            error: error
        })
    }) 
})

function searchHospitals( regex ){
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex})
        .populate('_user', 'name email img')
        .exec((err, result)=>{
            if (err) {
                reject("Error finding Hospitals", err)
            } else {
                resolve(result)
           }
        }) 
    })
}

function searchDoctors( regex ){
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex})
        .populate('_user', 'name email img')
        .populate('_hospital')
        .exec((err, result)=>{
            if (err) {
                reject("Error finding Doctors", err)
            } else {
                resolve(result)
           }
        }) 
    })
}

function searchUser( regex ){
    return new Promise((resolve, reject)=>{
        User.find({}, 'name email role img')
            .or([{ 'name': regex}, { 'email': regex}])
            .exec((err, result)=>{
                if (err) {
                    reject('Error finding User', err)
                } else {
                    resolve(result)
                }
            }) 
    })
}

module.exports = searchRouter;