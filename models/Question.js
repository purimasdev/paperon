const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user'
  },
  tipe: {
    type: String,
  },
  teks: {
    type: String,
    min: 3,
    max: 255
  },
  jmlOpsi: {
    type: Number
  },
  opsi: [{
    type: String,
  }]
}, { timestamps: true })

module.exports = mongoose.model('question', questionSchema)