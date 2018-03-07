const express = require('express')
const doctorRouter = express();


const Doctor = require('../models/doctor')

//middleware Authentication
const mdAuthentication = require('../middlewares/authentication')



doctorRouter.get('/', ( req, res, next ) => {
    
    let from = req.query.from || 0;
    from = Number(from)

    const elem = 10;

    Doctor.find({})
    .skip(from)
    .limit(elem)
    .populate('_user', 'name email')
    .populate('_hospital')
    .exec((err, doctors)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error finding Doctors',
                error: err,
            })
        }

        Doctor.count({}, (err, count)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding Doctors',
                    error: err,
                })
            }
            return res.status(200).json({
                ok: true,
                doctors: doctors,
                total: count
            })
        })
    })
});


doctorRouter.post('/', mdAuthentication.verifyToken, (req, res, next)=>{
    const body = req.body;

    const doctor = new Doctor ({
        name: body.name,
        img: body.img,
        _hospital: body.hospital,
        _user: req.user._id
    })
    
    doctor.save(doctor, (err, newDoctor)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error creating Doctor',
                error: err
            })
        }

        return res.status(200).json({
            ok: true,
            doctor: newDoctor
        })
    })
});

doctorRouter.put('/:id', mdAuthentication.verifyToken, (req, res, next) => {
    
    const id = req.params.id;
    const body = req.body;

    const newDoctor = {
        name: body.name,
        img: body.img,
        hospital: body.hospital,
        user: req.user._id,
    } 

    Doctor.findByIdAndUpdate(id, newDoctor, {new: true}, (err, doctor)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error updating Doctor',
                error: err
            }) 
        }

        return res.status(200).json({
            ok: true,
            doctor: doctor
        })
    })

})

doctorRouter.delete('/:id', mdAuthentication.verifyToken, (req, res, next) => {
    const id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctor)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error removing doctor',
                error: err
            })
        }

        if(!doctor){
            return res.status(400).json({
                ok: false,
                message: 'Not found doctor for id'+ id,
                error: err,
            })
        }

        return res.status(200).json({
            ok:true,
            doctor: doctor
        })
    })
})



module.exports = doctorRouter;