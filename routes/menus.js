const express = require('express')
const router = express.Router()
const MenuModel = require('../models/MenuModel')

router.get('/', async (req, res, next) => {
    try{
        const data = await MenuModel.getData()
        res.json(data)
    }catch(err){
        next(err)
    }
})

router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    try{
        const update = await MenuModel.updateData(name, id)
        res.json({msg: 'patch success'})
    }catch(err){
        next(err)
    }
})

module.exports = router