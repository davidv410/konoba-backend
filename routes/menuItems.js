const express = require('express')
const dbImport = require('./dbConnection')

const router = express.Router()
const db = dbImport.db

router.get('/', (req, res) => {

    const query = `SELECT 
            menu_items.id, 
            menu_items.name, 
            menu_items.price, 
            menu_items.description, 
            menu_items.menu_id, 
            menu_items.subgroup_id,
            COUNT(meat_type.id) AS meat_count
        FROM menu_items
        LEFT JOIN subgroups ON menu_items.subgroup_id = subgroups.id
        LEFT JOIN meat_type ON menu_items.id = meat_type.menu_item_id
        GROUP BY menu_items.id
        ORDER BY meat_count DESC, subgroups.id
       `
    
    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        
        res.json(data);
           
    })
})

router.post('/', (req, res) => {

    const query = `INSERT INTO menu_items(name, price, description, menu_id, subgroup_id) VALUES (?,?,?,?,?)`
    const { menuItem, meatArr } = req.body;

    let subgroup_id = menuItem.subgroup_id
    if(!subgroup_id || subgroup_id === ""){
        subgroup_id = null;
    }

    let price = menuItem.price
    if(meatArr && meatArr.length > 0){
        price = null
    }else{
        price = menuItem.price
    }

    if(menuItem && Object.keys(menuItem).length > 0){
        db.query(query, [menuItem.name, price, menuItem.descr, menuItem.menu_id, subgroup_id], (err, data) => {
            if(data){
                const menuItemId = data.insertId;
                            if(meatArr && meatArr.length > 0){
                                    const query = `INSERT INTO meat_type(meat, price, menu_item_id) VALUES (?,?,?)`
                                    meatArr.forEach(item => {
                                        db.query(query, [item.meat, item.price, menuItemId], (err, data) => {
                                            if(data){
                                                console.log(data)
                                            }else{
                                                console.log(err)
                                            }
                                        })
                                    });
                            }
                res.json(data)
            }else{
                console.log(err)
            }
        })

    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    db.query("DELETE FROM menu_items WHERE id = ?", [id], (err, data) => {
        if (err) {res.json({ message: 'Failed to delete item', data });}
        res.json({ message: 'Item deleted successfully', data });
    })


})

module.exports = router