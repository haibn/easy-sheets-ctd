const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const { login, register, getCurrentUser } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/current-user', authenticateUser, getCurrentUser)

module.exports = router