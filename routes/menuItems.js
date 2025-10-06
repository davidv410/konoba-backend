const express = require('express')
const pool = require('./dbConnection')

const router = express.Router()

router.get('/', async (req, res) => {
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
        ORDER BY meat_count DESC, subgroups.id`
        
    try {
        const [data] = await pool.execute(query)
        res.json(data)
    } catch (err) {
        console.error('Error fetching menu items:', err)
        res.status(500).json({ error: 'Failed to fetch menu items' })
    }
})

router.post('/', async (req, res) => {
    const query = `INSERT INTO menu_items(name, price, description, menu_id, subgroup_id) VALUES (?,?,?,?,?)`
    const { menuItem, meatArr } = req.body;

    let subgroup_id = menuItem.subgroup_id
    if (!subgroup_id || subgroup_id === "") {
        subgroup_id = null;
    }

    let price = menuItem.price
    if (meatArr && meatArr.length > 0) {
        price = null
    } else {
        price = menuItem.price
    }

    try {
        if (menuItem && Object.keys(menuItem).length > 0) {
            const [data] = await pool.execute(query, [menuItem.name, price, menuItem.descr, menuItem.menu_id, subgroup_id])
            const menuItemId = data.insertId;

            if (meatArr && meatArr.length > 0) {
                const meatQuery = `INSERT INTO meat_type(meat, price, menu_item_id) VALUES (?,?,?)`
                
                // Insert all meat types
                for (const item of meatArr) {
                    await pool.execute(meatQuery, [item.meat, item.price, menuItemId])
                }
            }
            
            res.json(data)
        }
    } catch (err) {
        console.error('Error creating menu item:', err)
        res.status(500).json({ error: 'Failed to create menu item' })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const [data] = await pool.execute("DELETE FROM menu_items WHERE id = ?", [id])
        
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu item not found' })
        }
        
        res.json({ message: 'Item deleted successfully', data })
    } catch (err) {
        console.error('Error deleting menu item:', err)
        res.status(500).json({ error: 'Failed to delete menu item' })
    }
})

module.exports = router