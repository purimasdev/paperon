const router = require('express').Router()

router.get('/', (req,res) => {
  res.render('responden/index')
})

module.exports = router