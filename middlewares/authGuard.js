const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { simpleDateTime } = require('../helpers/timeHelper')

// Ensure user is login
const ensureAuth = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.jwt
  // Check if token exist & verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err.message)
        res.redirect('/auth')
      } else {
        // console.log(decodedToken)
        next()
      }
    })
  } else {
    res.redirect('/auth')
  }
}

// Check current user
const checkUser = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.jwt
  // Check if token exist & verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        next()
      } else {
        let user = await User.findById(decodedToken.id).select(["-password","-__v"]).lean()
        user.createdAt = simpleDateTime(user.createdAt)
        user.updatedAt = simpleDateTime(user.updatedAt)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = {
  ensureAuth,
  checkUser
}