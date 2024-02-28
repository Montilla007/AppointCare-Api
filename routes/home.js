const express = require('express')

const router = express.Router()
const {
  createHome,
  deleteHome,
  updateHome,
  getHome,
} = require('../controllers/home')

router.get('/', getHome)
router.post('/', createHome)
router.put('/', updateHome)
router.delete('/', deleteHome)

module.exports = router