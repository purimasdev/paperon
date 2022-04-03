// IMPORT MODULE
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// IMPORT FILE
const setting = require('../configs/setting')
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validators/authValidator')

// Max Age = 1 Hour
const maxAge = 60 * 60

// JWT TOKEN
const createToken = (id, level) => {
  return jwt.sign({ id, level }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  })
}

// INDEX (GET)
router.get('/', (req, res) => {
  // redirect if already logged in
  if (res.locals.user !== null) return res.redirect('/admin')
  // Render if not logged in
  res.render('auth/index', {
    setting
  })
})

// REGISTER (POST)
router.post('/register', async (req, res) => {

  // Validate req.body
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).json({ status: 'error', message: error.details[0].message })
  // Destructuring req.body
  let { nama, email, password: plainPassword } = req.body
  // Check if email exist in db
  const emailExist = await User.findOne({ email }).lean()
  if (emailExist) return res.status(400).json({ status: 'error', message: 'Email already exist' })
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(plainPassword, salt)
  // Create new User
  const user = new User({
    nama, email, password
  })
  // Add access level to user if ADMIN
  if (user.email === process.env.ADMIN_EMAIL) {
    user.level = 'admin'
  }
  // Register user
  try {
    const savedUser = await user.save()
    const token = createToken(savedUser._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ status: 'ok', message: 'Register Success, redirect to Dashboard' })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error })
  }
})

// LOGIN (POST)
router.post('/login', async (req, res) => {
  // Validate req.body
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).json({ status: 'error', message: error.details[0].message })
  // Destructuring req.body
  let { email, password: plainPassword } = req.body
  // Check if email exist in db
  const foundUser = await User.findOne({ email }).lean()
  if (!foundUser) return res.status(400).json({ status: 'error', message: 'Invalid Email / Password' })
  // Check password
  const auth = await bcrypt.compare(plainPassword, foundUser.password)
  if (!auth) return res.status(400).json({ status: 'error', message: 'Invalid Email / Password' })
  // Logged in user
  try {
    const token = createToken(foundUser._id, foundUser.level)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ status: 'ok', message: 'Login Success, redirect to Dashboard', data: foundUser.level })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error })
  }
})

// LOGOUT (GET)
router.route('/logout')
  .get((req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
  })

module.exports = router