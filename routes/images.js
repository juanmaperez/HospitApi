const express = require('express')

const imagesRouter = express();
const fs = require('fs');

const pathManager = require('path');

imagesRouter.get('/:collection/:img', (req, res, next)=>{

    const collection = req.params.collection;
    const img = req.params.img;

    let path = `./uploads/${collection}/${img}`;

    if( !fs.existsSync(path) ) {
        path = './assets/no-img.jpg';
    }

    res.sendFile(pathManager.resolve(path));
})

module.exports = imagesRouter;