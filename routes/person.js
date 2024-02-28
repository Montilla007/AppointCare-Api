const express = require('express')
const router = express.Router()

const { users, usersId, usersUpdate, usersDelete } = require('../controllers/person')

router.get('/users', users)
router.get('/users/:id', usersId)
router.put('/users/:id', usersUpdate)
router.delete('/users/:id', usersDelete)

module.exports = router;