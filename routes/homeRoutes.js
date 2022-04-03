const router = require('express').Router()

router.get('/', (req,res) => {
  if (res.locals.user !== null) return res.redirect('/admin')
  res.render('home/index')
})

module.exports = router