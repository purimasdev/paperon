const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'form'
  },
  identitas: {
    nama: { type: String },
    email: { type: String }
  },
  jawaban: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    value: [{type: String}]
  }]

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)