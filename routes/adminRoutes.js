const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { simpleDateTime } = require('../helpers/timeHelper')
const { registerValidation } = require('../validators/authValidator')

// DASHBOARD (GET)
router.get('/', (req, res) => {
  res.render('admin/index', {
    navTitle: { a: 'Dashboard', b: 'Admin' },
    menus: [
      { text: 'List Kreator', link: '/admin/kreator-list', icon: 'format_list_bulleted', btn: '' },
      { text: 'Tambah Kreator', link: '/admin/kreator-tambah', icon: 'add_circle_outline', btn: '' },
    ]
  })
})

// KREATOR-LIST (GET)
router.route('/kreator-list')
  .get(async (req, res) => {
    let kreators = []
    try {
      kreators = await User.find({ 'level': 'kreator' }).select(["-password", "-__v"]).sort({createdAt:-1}).lean()
    } catch (error) {
      console.log(error)
    }
    res.render('admin/kreator-list', {
      navTitle: { a: 'List', b: 'Kreator' },
      back: [
        { text: 'dash', link: '/admin', icon: 'dashboard', btn: 'is-info', },
      ],
      kreators
    })
  })

// KREATOR-DETAIL (GET)
router.route('/kreator-detail')
  .get(async (req, res) => {
    let found = undefined
    let keys = []
    try {
      // Check if req URL has query
      if (Object.keys(req.query).length > 0) {
        // Check if req.query has id
        if (req.query['id']) {
          // set req.query to query object
          found = await User.findById(req.query['id']).select(["-password", "-__v", "-level"]).lean()
          found.createdAt = simpleDateTime(found.createdAt)
          found.updatedAt = simpleDateTime(found.updatedAt)
          keys = Object.keys(found)
        } else {
          return res.redirect('/admin/kreator-list')
        }
      } else {
        return res.redirect('/admin/kreator-list')
      }
    } catch (error) {
      console.log(error)
    }

    res.render('admin/kreator-detail', {
      navTitle: { a: 'Detail', b: 'Kreator' },
      back: [
        { text: 'list', link: '/admin/kreator-list', icon: 'keyboard_backspace', btn: 'is-warning', },
        { text: 'dash', link: '/admin', icon: 'dashboard', btn: 'is-info', },
      ],
      kreator: found,
      keys
    })
  })
  .delete(async (req, res) => {
    try {
      // Check if req URL has query
      if (Object.keys(req.query).length > 0) {
        // Check if req.query has id
        if (req.query['id']) {
          // set req.query to query object
          let deleted = await User.findByIdAndDelete(req.query['id'])
          if (!deleted) return res.status(400).json({ status: 'error', message: 'Error Deleting User' })
          return res.status(200).json({ status: 'ok', message: 'Berhasil menghapus Kreator, halaman akan dialihkan' })
        } else return res.status(400).json({ status: 'error', message: 'Need id as query string' })
      } else return res.status(400).json({ status: 'error', message: 'Need id as query string' })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  })

// KREATOR-TAMBAH (POST)
router.route('/kreator-tambah')
  .get((req, res) => {
    res.render('admin/kreator-tambah', {
      navTitle: { a: 'Tambah', b: 'Kreator' },
      back: [
        { text: 'dash', link: '/admin', icon: 'dashboard', btn: 'is-info', },
      ],
      form: [
        { text: 'nama', tipe: 'text' },
        { text: 'email', tipe: 'email' },
        { text: 'password', tipe: 'password' },
      ]
    })
  })
  .post(async (req, res) => {
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
    // Create new Kreator
    const user = new User({
      nama, email, password
    })
    // Register kreator
    try {
      const savedUser = await user.save()
      res.status(201).json({ status: 'ok', message: 'Tambah Kreator Sukses, dialihkan ke List Kreator' })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  })

module.exports = router