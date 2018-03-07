const express = require('express')

const imagesRouter = express();
const fs = require('fs');

imagesRouter.get('/:collection/:img', (req, res, next)=>{

    const collection = req.params.collection;
    const img = req.params.img;

    const path = `./uploads/${collection}/${img}`;

    fs.exists(path, image=>{
        if(!image){
            path = './assets/no-image.jpg';
        }
    })

    res.sendFile(path);
})

module.exports = imagesRouter;