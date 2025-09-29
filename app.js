const express = require('express')
const dotenv = require('dotenv').config()
const dbImport = require('./routes/dbConnection')
const cors = require('cors')
const cookieParser = require('cookie-parser');


const app = express()
const db = dbImport.db

app.use(express.json())
app.use(cors({
  origin: [
    'https://konobaivinaarka.com',
    'https://www.konobaivinaarka.com',
    'http://localhost:5173',
  ],
  credentials: true,
}));

app.use(cookieParser());

const blogRoute = require('./routes/blogRoute.js')
app.use('/blog', blogRoute)

const bookTableRoute = require('./routes/bookTable.js')
app.use('/book-table', bookTableRoute)

const bookTableConfirmRoute = require('./routes/bookTableConfirm.js')
app.use('/book-table-confirm', bookTableConfirmRoute)

const contactRoute = require('./routes/contact.js')
app.use('/contact', contactRoute)

const menusRoute = require('./routes/menus.js')
app.use('/menus', menusRoute)

const menusSgRoute = require('./routes/menusSg.js')
app.use('/menus-sg', menusSgRoute)

const menuItemsRoute = require('./routes/menuItems.js')
app.use('/menu-items', menuItemsRoute)

const menuItemMore = require('./routes/menuItemMore.js')
app.use('/menu-item-more', menuItemMore)

const bookTableList = require('./routes/bookTableList.js')
app.use('/book-table-list', bookTableList)

const galleryRoute = require('./routes/galleryRoute.js')
app.use('/gallery-route', galleryRoute)

const loginRoute = require('./routes/loginRoute.js')
app.use('/login', loginRoute)

const logoutRoute = require('./routes/logoutRoute.js')
app.use('/logout', logoutRoute)

const blogUpdateRoute = require('./routes/blogUpdateRoute.js')
app.use('/blog-update-route', blogUpdateRoute)

const healthRoute = require('./routes/healthRoute.js')
app.use('/health', healthRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})