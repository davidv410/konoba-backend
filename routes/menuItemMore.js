const express = require('express')
const MenuMoreModel = require('../models/MenuMoreModel')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try{
        const data = await MenuMoreModel.getData()
        res.json(data)
    }catch(err){
       next(err)
    }
})

module.exports = router