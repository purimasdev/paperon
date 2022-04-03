const router = require('express').Router()
const ObjectId = require('mongoose').Types.ObjectId
// const User = require('../models/User')
const Question = require('../models/Question')
const Form = require('../models/Form')
// const Result = require('../models/Result')
const { ubahTipe, potongStr, ubahPertanyaan, cetakTag } = require('../helpers/textHelper')
const { simpleDate, simpleDateTime } = require('../helpers/timeHelper')

function toObjectId(id) {
  let result = new ObjectId(id)
  return result
}

// INDEX
router.get('/', (req, res) => {
  res.render('kreator/index', {
    navTitle: { a: 'Dashboard', b: 'Kreator' },
    menus: [
      { text: 'Profil', link: '/kreator/profil', icon: 'account_circle', btn: '' },
      { text: 'Tambah Pertanyaan', link: '/kreator/pertanyaan-tambah', icon: 'note_add', btn: '' },
      { text: 'List Pertanyaan', link: '/kreator/pertanyaan-list', icon: 'format_list_bulleted', btn: '' },
      { text: 'Buat Kuesioner', link: '/kreator/kuesioner-tambah', icon: 'library_add', btn: '' },
      { text: 'List Kuesioner', link: '/kreator/kuesioner-list', icon: 'view_list', btn: '' },
      { text: 'Publikasi', link: '/kreator/publikasi', icon: 'publish', btn: '' },
      { text: 'Hasil Kuesioner', link: '/kreator/hasil', icon: 'assessment', btn: '' },
    ]
  })
})

router.get('/profil', (req, res) => {
  let keys = Object.keys(res.locals.user)
  res.render('kreator/profil', {
    navTitle: { a: 'Profil', b: 'Kreator' },
    back: [
      { text: 'dash', link: '/kreator', icon: 'dashboard', btn: 'is-info', },
    ],
    kreator: res.locals.user,
    keys
  })
})

// router.get('/profil-edit', (req,res) => {
//   res.send('Profil Edit',{
//     navTitle: { a: 'Edit', b: 'Profil' },
//     back: [
//       { text: 'dash', link: '/kreator', icon: '', btn: '', },
//       { text: 'profil', link: '/kreator/profil', icon: '', btn: '', },
//     ],
//     kreator: res.locals.user
//   })
// })

router.get('/pertanyaan-list', async (req, res) => {
  let questions = await Question.find({ userId: res.locals.user._id }).lean()
  res.render('kreator/pertanyaan-list', {
    navTitle: { a: 'List', b: 'Pertanyaan' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'tambah', link: '/kreator/pertanyaan-tambah', icon: '', btn: '', },
    ],
    questions,
    ubahTipe,
    potongStr
  })
})

router.get('/pertanyaan-detail', async (req, res) => {
  let found = undefined
  let keys = []
  try {
    // Check if req URL has query
    if (Object.keys(req.query).length > 0) {
      // Check if req.query has id
      if (req.query['id']) {
        // set req.query to query object
        found = await Question.findById(req.query['id']).select(["-userId", "-__v"]).lean()
        found.createdAt = simpleDateTime(found.createdAt)
        found.updatedAt = simpleDateTime(found.updatedAt)
        found.tipe = ubahTipe(found.tipe)
        keys = Object.keys(found)
      } else {
        return res.redirect('/404')
      }
    } else {
      return res.redirect('/404')
    }
  } catch (error) {
    console.log(error)
  }
  res.render('kreator/pertanyaan-detail', {
    navTitle: { a: 'Detail', b: 'Pertanyaan' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'list', link: '/kreator/pertanyaan-list', icon: '', btn: '', },
    ],
    question: found,
    keys
  })
})

router.route('/pertanyaan-tambah')
  .get((req, res) => {
    res.render('kreator/pertanyaan-tambah', {
      navTitle: { a: 'Tambah', b: 'Pertanyaan' },
      back: [
        { text: 'dash', link: '/kreator', icon: '', btn: '', },
        { text: 'list', link: '/kreator/pertanyaan-list', icon: '', btn: '', },
      ],
    })
  })
  .post(async (req, res) => {
    try {
      let question = new Question({ ...req.body })
      let savedQuestion = await question.save()
      res.status(201).json({ status: 'ok', message: 'Sukses tambah pertanyaan, halaman akan dimuat ulang' })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  })

router.get('/kuesioner-list', (req, res) => {
  res.render('kreator/kuesioner-list', {
    navTitle: { a: 'List', b: 'Kuesioner' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'tambah', link: '/kreator/kuesioner-tambah', icon: '', btn: '', },
    ],
  })
})

router.get('/kuesioner-detail', (req, res) => {
  res.render('kreator/kuesioner-detail', {
    navTitle: { a: 'Detail', b: 'Kuesioner' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'list', link: '/kreator/kuesioner-list', icon: '', btn: '', },
    ],
  })
})

router.route('/kuesioner-tambah')
  .get((req, res) => {
    res.render('kreator/kuesioner-tambah', {
      navTitle: { a: 'Tambah', b: 'Kuesioner' },
      back: [
        { text: 'dash', link: '/kreator', icon: '', btn: '', },
        { text: 'list', link: '/kreator/kuesioner-list', icon: '', btn: '', },
      ],
      menus: [
        { text: 'List Draf', link: '/kreator/draf-list', icon: 'home', btn: 'is-success' },
        { text: 'List Order', link: '/kreator/order-list', icon: 'home', btn: 'is-success' },
        { text: 'List Review', link: '/kreator/review-list', icon: 'home', btn: 'is-success' },
      ],
    })
  })
  .post(async (req, res) => {
    try {
      let form = new Form({ ...req.body })
      let savedForm = await form.save()
      res.status(201).json({ status: 'ok', message: 'Sukses membuat draf kuesioner, halaman akan dialihkan', data: form._id })
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  })

router.get('/draf-list', async (req, res) => {
  let forms = await Form
    .find({ userId: res.locals.user._id, stage: 'draft' })
    .select(["_id", "stage", "judul", "createdAt"])
    .sort({ createdAt: -1 })
    .lean()
  forms.forEach(form => {
    form.createdAt = simpleDate(form.createdAt)
  })
  res.render('kreator/draf-list', {
    navTitle: { a: 'List', b: 'Draf' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'kembali', link: '/kreator/kuesioner-tambah', icon: '', btn: '', },
    ],
    lists: forms
  })
})

router.route('/draf')
  .get(async (req, res) => {
    let form = undefined
    let questions = undefined
    // let keys = []
    try {
      // Check if req URL has query
      if (Object.keys(req.query).length > 0) {
        // Check if req.query has id
        if (req.query['id']) {
          // set req.query to query object
          form = await Form
            .findById(req.query['id'])
            .select(["_id", "stage", "judul", "deskripsi", "createdAt"])
            .lean()
          form.createdAt = simpleDate(form.createdAt)
          questions = await Question
            .find({ userId: res.locals.user._id })
            .select(["_id", "tipe", "teks"])
            .lean()
          questions.forEach(question => {
            question.tipe = ubahTipe(question.tipe)
          })
        } else {
          return res.redirect('/404')
        }
      } else {
        return res.redirect('/404')
      }
    } catch (error) {
      console.log(error)
    }
    res.render('kreator/draf', {
      navTitle: { a: 'Draf', b: '' },
      back: [
        { text: 'dash', link: '/kreator', icon: '', btn: '', },
        { text: 'list', link: '/kreator/draf-list', icon: '', btn: '', },
      ],
      form,
      questions,
      potongStr
    })
  })
  .post(async (req, res) => {
    try {
      // Destructure
      let { id } = req.query
      let { pertanyaan } = req.body
      // Find Questions
      let questions = await Question
        .find({ _id: { $in: pertanyaan } }, { "_id": 1, "tipe": 1, "teks": 1, "jmlOpsi": 1, "opsi": 1 })
        .lean()
      // Add field
      questions.forEach(el => {
        el.prioritas = null
        el.indeks = null
      });
      // Update Form with Questions
      let form = await Form.findByIdAndUpdate(
        id,
        {
          "$push": {
            "pertanyaan": { "$each": questions },
          },
          "stage": "order"
        },
        { "new": true, upsert: true }
      )
      // Check
      if (form) {
        res.status(201).json({ status: 'ok', message: 'Sukses menambah pertanyaan ke kuesioner, halaman akan dialihkan', data: form._id })
      } else {
        res.status(400).json({ status: 'error', message: error.message })
      }
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  })

router.get('/order-list', async (req, res) => {
  let forms = await Form
    .find({ userId: res.locals.user._id, stage: 'order' })
    .select(["_id", "stage", "judul", "createdAt"])
    .sort({ updatedAt: -1 })
    .lean()
  forms.forEach(form => {
    form.createdAt = simpleDate(form.createdAt)
  })
  res.render('kreator/order-list', {
    navTitle: { a: 'List', b: 'Order' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'kembali', link: '/kreator/kuesioner-tambah', icon: '', btn: '', },
    ],
    lists: forms
  })
})

router.route('/order')
  .get(async (req, res) => {
    let form = undefined
    try {
      // Check if req URL has query
      if (Object.keys(req.query).length > 0) {
        // Check if req.query has id
        if (req.query['id']) {
          // set req.query to query object
          form = await Form
            .findById(req.query['id'])
            .lean()
          form.createdAt = simpleDate(form.createdAt)
        } else {
          return res.redirect('/404')
        }
      } else {
        return res.redirect('/404')
      }
    } catch (error) {
      console.log(error)
    }
    res.render('kreator/order', {
      navTitle: { a: 'Order', b: '' },
      back: [
        { text: 'dash', link: '/kreator', icon: '', btn: '', },
        { text: 'list', link: '/kreator/order-list', icon: '', btn: '', },
      ],
      form,
      ubahTipe
    })
  })
  .post(async (req, res) => {
    try {
      // Destructure
      let { id } = req.query
      let { body } = req
      let keys = Object.keys(body)

      // Find Questions
      let { pertanyaan } = await Form.findById(id).lean()

      // Chnage prioritas dan indeks
      for (let i = 0; i < pertanyaan.length; i++) {
        for (let j = 0; j < keys.length; j++) {
          if (pertanyaan[i]._id == keys[j]) {
            pertanyaan[i].prioritas = body[keys[j]].prioritas
            pertanyaan[i].indeks = body[keys[j]].indeks
          }
        }
      }

      // Update Form with new Prioritas and Indeks
      let form = await Form.findByIdAndUpdate(
        id, { pertanyaan, "stage": "review" }, { new: true }
      )
      // Check
      if (form) {
        res.status(201).json({ status: 'ok', message: 'Sukses menambah prioritas dan indeks kuesioner, halaman akan dialihkan', data: form._id })
      } else {
        res.status(400).json({ status: 'error', message: error.message })
      }
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  })

router.get('/review-list', async (req, res) => {
  let forms = await Form
    .find({ userId: res.locals.user._id, stage: 'review' })
    .select(["_id", "stage", "judul", "createdAt"])
    .sort({ updatedAt: -1 })
    .lean()
  forms.forEach(form => {
    form.createdAt = simpleDate(form.createdAt)
  })
  res.render('kreator/review-list', {
    navTitle: { a: 'List', b: 'Review' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'kembali', link: '/kreator/kuesioner-tambah', icon: '', btn: '', },
    ],
    lists: forms
  })
})

router.route('/review')
  .get(async (req, res) => {
    let form = undefined
    try {
      // Check if req URL has query
      if (Object.keys(req.query).length > 0) {
        // Check if req.query has id
        if (req.query['id']) {
          // set req.query to query object
          form = await Form
            .findById(req.query['id'])
            .lean()
          form.createdAt = simpleDate(form.createdAt)
        } else {
          return res.redirect('/404')
        }
      } else {
        return res.redirect('/404')
      }
    } catch (error) {
      console.log(error)
    }
    res.render('kreator/review', {
      navTitle: { a: 'Review', b: '' },
      back: [
        { text: 'dash', link: '/kreator', icon: '', btn: '', },
        { text: 'list', link: '/kreator/review-list', icon: '', btn: '', },
      ],
      btn: [
        { text: 'Susun', form: 'formPut', id: 'formPutBtn', icon: 'arrow_back_ios', btn: 'is-info' },
        { text: 'Simpan', form: 'formPatch', id: 'formPatchBtn', icon: 'home', btn: 'is-success' }
      ],
      form,
      ubahTipe,
      potongStr,
      ubahPertanyaan,
      cetakTag
    })
  })
  .post(async (req, res) => {
    console.log(req.body)
    console.log(req.method)
  })
  .put(async (req, res) => {
    console.log(req.body)
    console.log(req.method)
  })

router.get('/publikasi', (req, res) => {
  res.render('kreator/Publikasi', {
    navTitle: { a: 'Status', b: 'Publikasi' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
    ],
  })
})

router.get('/hasil-list', (req, res) => {
  res.render('kreator/hasil-list', {
    navTitle: { a: 'List', b: 'Hasil' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
    ],
  })
})

router.get('/hasil-detail', (req, res) => {
  res.render('kreator/hasil-detail', {
    navTitle: { a: 'Detail', b: 'Hasil' },
    back: [
      { text: 'dash', link: '/kreator', icon: '', btn: '', },
      { text: 'list', link: '/kreator/detail-list', icon: '', btn: '', },
    ],
  })
})

module.exports = router