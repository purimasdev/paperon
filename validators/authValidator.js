// IMPORT MODULE
const Joi = require('joi')

// Register validation (nama, email, password)
const registerValidation = (data) => {
  const schema = Joi.object({
    nama: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

// Login validation (email, password)
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

module.exports = {
  registerValidation,
  loginValidation,
}