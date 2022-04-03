const router = require('express').Router()
const Form = require('../models/Form')
const User = require('../models/User')
const Result = require('../models/Result')
const { ubahTipe, potongStr, ubahPertanyaan, cetakTag } = require('../helpers/textHelper')

router.get('/', (req, res) => {
  res.redirect('/responden/cari')
})

router.route('/cari')
  .get(async (req, res) => {
    res.render('responden/cari', {
      navTitle: { a: 'Pencarian', b: 'Kuesioner' },
      back: [
        { text: 'kembali', link: '/', icon: '', btn: '', }
      ],
    })
  })
  .post(async (req, res) => {
    let { kode } = req.body
    let kuesioner = await Form.findOne({ kode, "status": "publish" }).lean()
    if (!kuesioner) {
      return res.status(404).json({ status: 'error', message: 'Kuesioner tidak ditemukan, cek kembali kode yang dimasukkan' })
    }
    return res.status(302).json({ status: 'ok', message: 'Kuesioner ditemukan, halaman akan alihkan', data: `/responden/jawab?uid=${kuesioner.userId}&fid=${kuesioner._id}` })
  })

router.route('/jawab')
  .get(async (req, res) => {
    let { uid, fid } = req.query
    // console.log({ uid, fid })
    let kreator = await User.findById(uid, "nama email").lean()
    let kuesioner = await Form.findById(fid).lean()
    res.render('responden/jawab', {
      navTitle: { a: 'jawab', b: 'Kuesioner' },
      back: [
        { text: 'kembali', link: '/', icon: '', btn: '', }
      ],
      kreator,
      kuesioner,
      ubahPertanyaan,
      cetakTag
    })
  })
  .post(async (req, res) => {
    let result = new Result(req.body)
    // console.log(result)
    let saved = await result.save()
        // Check
        if (saved) {
          return res.status(201).json({ status: 'ok', message: 'Jawaban telah disimpan. Terima kasih atas partisipasi anda dalam menjawab kuesioner ini' })
        } else {
          return res.status(400).json({ status: 'error', message: error.message })
        }
  })

module.exports = router