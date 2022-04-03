const jwt = require('jsonwebtoken')

const isAdmin = (req, res, next) => {
  // CHECK USING LEVEL FROM JWT TOKEN
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err)
        res.redirect('/auth')
      } else {
        // console.log(decodedToken)
        if (decodedToken.level === 'admin') {
          next()
        } else {
          res.redirect('/kreator')
        }
      }
    })
  } else {
    res.redirect('/auth')
  }
}

const isKreator = (req, res, next) => {
  // CHECK USING LEVEL FROM JWT TOKEN
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err)
        res.redirect('/auth')
      } else {
        // console.log(decodedToken)
        if (decodedToken.level === 'kreator') {
          next()
        } else {
          res.redirect('/auth')
        }
      }
    })
  } else {
    res.redirect('/auth')
  }
}

module.exports = {
  isAdmin,
  isKreator
}