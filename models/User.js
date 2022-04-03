const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    min: 4,
    max: 255,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  level: {
    type: String,
    enum: ['admin', 'kreator'],
    default: 'kreator'
  }
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)