const express = require('express')
const MenuItemsModel = require('../models/MenuItemsModel')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const data = await MenuItemsModel.getData()
        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    const { menuItem, meatArr } = req.body;
    try {
        const data = await MenuItemsModel.insertData(menuItem, meatArr)
        res.json({ message: 'Item created', data })
    } catch (err) {
        next(err)
    }
})


router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    const { name, price, description, meat_count, meats } = req.body
    try{
        if(meat_count && meats.length > 0){
        const update = await MenuItemsModel.updateMeatData(name, price, description, meat_count, meats, id)
        return res.json({ message: 'Item updated successfully' })
    }
        const updateData = await MenuItemsModel.updateData(name, description, price, id)
        return res.json({ message: 'Item updated successfully' })
    }catch(err){
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const deleteData = await MenuItemsModel.deleteData(id)
        if (deleteData.affectedRows === 0) {return res.status(404).json({ message: 'Item not found' })}
        res.json({ message: 'Item deleted successfully', deleteData })
    } catch (err) {
        next(err)
    }
})

module.exports = router