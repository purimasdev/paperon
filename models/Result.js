const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'form'
  },
  identitas: {
    nama: { type: String },
    email: { type: String }
  },
  jawab: {}

}, { timestamps: true })

module.exports = mongoose.model('result', resultSchema)