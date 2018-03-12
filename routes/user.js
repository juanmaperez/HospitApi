const express = require('express')

const userRouter = express();
const User = require('../models/user');

// Bcrypt for passwords
const bcrypt = require('bcryptjs');
const salt = 10;

//middleware Authentication
const mdAuthentication = require('../middlewares/authentication')



userRouter.get('/', (req, res, next)=>{
    
    let from = req.query.from || 0;
    from = Number(from)

    const elem = 10;

    User.find({}, 'name email img role')
    .skip(from)
    .limit(elem)
    .exec((err, users)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error getting users',
                errors: err
            })
        }
        User.count({}, (err, count)=>{
            
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error getting users',
                    errors: err
                })
            }

            return res.status(200).json({
                ok: true,
                users: users,
                total: count
            })

        })
       
    })  
})

userRouter.post('/', (req, res) => {
    
    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        img: body.img,
        role: body.role,
    })

    user.save((err, newUser)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error saving user',
                errors: err
            })
        }
        newUser.password = 'Not displayed'
        return res.status(201).json({
            ok: true,
            user: newUser
        })

    }) 
})

userRouter.put('/:id', mdAuthentication.verifyToken, (req, res)=>{
    
    const id = req.params.id;
    const body = req.body;

    User.findById( id, (err, user) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            })
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                message: 'Not user for id:' + id,
                errors: {message: 'Not user for id:' + id}
            })
        }

        user.name = body.name;
        user.email = body.email;
        user.img = body.img;
        user.role = body.role;

        user.save((err, newUser)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user',
                    errors: err
                })
            }
            
            newUser.password = 'Not displayed';

            return res.status(201).json({
                ok: true,
                user: newUser
            })
    
        }) 
    })
});


userRouter.delete('/:id', mdAuthentication.verifyToken, (req, res)=>{
    
    const id = req.params.id;
    
    User.findByIdAndRemove(id, (err, deletedUser) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error deleting user',
                errors: err
            })
        }

        if(!deletedUser){
            return res.status(400).json({
                ok: false,
                message: 'Not user for id:' + id,
                errors: {message: 'Not user for id:' + id}
            })
        }

        return res.status(201).json({
            ok: true,
            user: deletedUser
        })
    })
})

module.exports = userRouter;