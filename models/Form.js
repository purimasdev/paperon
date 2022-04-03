const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user'
  },
  stage: {
    type: String,
    enum: ['draft', 'order','review','done'],
    default: 'draft'
  },
  judul: {
    type: String,
    max: 255
  },
  deskripsi: {
    type: String,
    max: 1024
  },
  pertanyaan: [],
  tersusun: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['publish','unpublish'],
    default: 'unpublish'
  },
  kode: {
    type: String,
    default: null
  }
}, { timestamps: true })

module.exports = mongoose.model('form', formSchema)