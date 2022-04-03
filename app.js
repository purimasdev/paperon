// IMPORT MODULE
require('dotenv').config({ path: './configs/.env' })
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')
const cors = require("cors");
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

// IMPORT FILE
const connectDB = require('./configs/db')
const { checkUser, ensureAuth } = require('./middlewares/authGuard')
const { isAdmin, isKreator } = require('./middlewares/roleGuard')
const homeRoutes = require('./routes/homeRoutes')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const kreatorRoutes = require('./routes/kreatorRoutes')
const respondenRoutes = require('./routes/respondenRoutes')

// ASSIGN CONST
const app = express()
const PORT = process.env.NODE_DOCKER_PORT || 8080

// GLOBAL VARIABLE
app.locals.pml = {
  judul: 'Paperon',
  versi: '1.0.0',
  icon: {
    '96': '/logo/96.png',
    '192': '/logo/192.png'
  },
  avatar: '/logo/kreator.png'
}

// EXPRESS MIDDLEWARE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
// app.use(cors());
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))


// EXPRESS STATIC FILE
app.use(express.static(path.join(__dirname, 'public')))
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/bulmaEX', express.static(__dirname + '/node_modules/bulma-extensions'));
app.use('/bulmaRad', express.static(__dirname + '/node_modules/bulma-radio'));
app.use('/bulmaCB', express.static(__dirname + '/node_modules/bulma-checkbox'));
app.use('/icons', express.static(__dirname + '/node_modules/material-icons/iconfont'));

// EXPRESS ROUTES
app.get('*', checkUser)
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/admin', [ensureAuth, isAdmin], adminRoutes)
app.use('/kreator', [ensureAuth, isKreator], kreatorRoutes)
app.use('/responden', respondenRoutes)

// 404 Route
app.get('*', function (req, res) {
  res.status(404).render('home/error', {
    navTitle: { a: '404', b: 'Not Found' },
  })
});

// TRY CONNECT TO DB AND THEN START SERVER
try {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port : ${PORT}`)
    })
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}