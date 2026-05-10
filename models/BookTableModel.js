const pool = require('../routes/dbConnection')

const getBookedData = async () => {
    const [data] = await pool.execute("SELECT * FROM book_a_table")
    return data
}

const deleteBookedData = async (id) => {
    const [data] = await pool.execute("DELETE FROM book_a_table WHERE id = ?", [id])
    return data
}

const insertPending = async (name, email, phone, date, time, people) => {
    const VALUES = [name, email, phone, date, time, people]
    const query = `INSERT INTO pending_book_a_table (name, email, phone, date, time, people) VALUES (?, ?, ?, ?, ?, ?)`
    const [data] = await pool.execute(query, VALUES)
    return data
}

const getBookingsData = async () => {
    const [data] = await pool.execute("SELECT * FROM pending_book_a_table")
    return data
}

const getBookingData = async (id) => {
    const [data] = await pool.execute("SELECT * FROM pending_book_a_table WHERE id = ?", [id])
    return data
}

const insertBooking = async (name, email, phone, date, time, people) => {
    const query = `INSERT INTO book_a_table (name, email, phone, date, time, people) VALUES (?, ?, ?, ?, ?, ?)`
    const VALUES = [name, email, phone, date, time, people]

    const [data] = await pool.execute(query, VALUES)
    return data
}

const deletePending = async (id) => {
    const [data] = await pool.execute("DELETE FROM pending_book_a_table WHERE id = ?", [id]) 
    return data
}

module.exports = { getBookedData, deleteBookedData, insertPending, getBookingsData, getBookingData, insertBooking, deletePending }