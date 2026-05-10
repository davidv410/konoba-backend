const express = require('express')
const router = express.Router()
const MenuSgModel = require('../models/MenuSgModel')

router.get('/', async(req, res, next) => {
    try{
        const data = await MenuSgModel.getData()
        res.json(data)
    }catch(err){
        next(err)
    }
})

router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    try{
        const update = await MenuSgModel.updateData(name, id)
        res.json({msg: 'patch success'})
    }catch(err){
        next(err)
    }
})

module.exports = router