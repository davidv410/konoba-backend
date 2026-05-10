const pool = require('../routes/dbConnection')

const getData = async () => {
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
    const [data] = await pool.execute(query)
    return data
}

const updateMeatData = async (name, price, description, meat_count, meats, id) => {
        const [updateMeatData] = await pool.execute("UPDATE menu_items SET name = ?, description = ? WHERE id = ?", [name, description, id])
        await Promise.all(meats.map(meat => (
            pool.execute("UPDATE meat_type SET meat = ?, price = ? WHERE id = ?", [meat.meat, meat.price, meat.id])
        )));
        return
}

const updateData = async (name, description, price, id) => {
    const [updateData] = await pool.execute("UPDATE menu_items SET name = ?, description = ?, price = ? WHERE id = ?", [name, description, price, id])
    return updateData
}

const deleteData = async (id) => {
    const [deleteData] = await pool.execute("DELETE FROM menu_items WHERE id = ?", [id])
    return deleteData
}

const insertData = async (menuItem, meatArr) => {

    const price = (meatArr && meatArr.length > 0) ? '' : menuItem.price
    const subgroup_id = menuItem.subgroup_id || null
    
    const itemQuery = `INSERT INTO menu_items(name, price, description, menu_id, subgroup_id) VALUES (?,?,?,?,?)`
    const [insert] = await pool.execute(itemQuery, [menuItem.name, price, menuItem.descr, menuItem.menu_id, subgroup_id])
   
    const meatQuery = `INSERT INTO meat_type(meat, price, menu_item_id) VALUES (?,?,?)`
    if (meatArr && meatArr.length > 0) {
        for (const item of meatArr) {
            const [insertMeat] = await pool.execute(meatQuery, [item.meat, item.price, insert.insertId])
        }
    }

    return insert
}



module.exports = { getData, updateMeatData, updateData, deleteData, insertData }