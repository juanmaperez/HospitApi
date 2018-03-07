const express = require('express')
const hospitalRouter = express();


const Hospital = require('../models/hospital')

//middleware Authentication
const mdAuthentication = require('../middlewares/authentication')



hospitalRouter.get('/', ( req, res, next ) => {
    
    let from = req.query.from || 0;
    from = Number(from)
    
    const elem = 10;

    Hospital.find({})
    .skip(from)
    .limit(elem)
    .populate('_user', 'name email')
    .exec((err, hospitals)=>{
        console.log(from)

        if(err){
            return res.status(500).json({
                ok: true,
                message: 'Error finding Hospitals',
                error: err,
            })
        }

        Hospital.count({}, (err, count)=>{
            
            if(err){
                return res.status(500).json({
                    ok: true,
                    message: 'Error finding Hospitals',
                    error: err,
                })
            }

            return res.status(200).json({
                ok: true,
                hospitals: hospitals,
                total: count
            })
        });
    })
});


hospitalRouter.post('/', mdAuthentication.verifyToken, (req, res, next)=>{
    const body = req.body;

    const hospital = new Hospital ({
        name: body.name,
        img: body.img,
        _user: req.user._id
    })
    
    hospital.save(hospital, (err, newHospital)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error creating Hospital',
                error: err
            })
        }

        return res.status(200).json({
            ok: true,
            hospital: newHospital
        })
    })
});

hospitalRouter.put('/:id', mdAuthentication.verifyToken, (req, res, next) => {
    
    const id = req.params.id;
    const body = req.body;

    const newHospital = {
        name: body.name,
        img: body.img,
        user: req.user._id,
    }

    Hospital.findByIdAndUpdate(id, newHospital, (err, hospital)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error updating Hospital',
                error: err
            }) 
        }

        return res.status(200).json({
            ok: true,
            hospital: hospital
        })
    })

})

hospitalRouter.delete('/:id', mdAuthentication.verifyToken, (req, res, next) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error removing hospital',
                error: err
            })
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                message: 'Not found hospital for id'+ id,
                error: err,
            })
        }

        return res.status(200).json({
            ok:true,
            hospital: hospital
        })
    })
})



module.exports = hospitalRouter;