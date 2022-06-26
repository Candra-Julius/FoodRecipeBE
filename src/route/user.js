const express = require('express')
const { getProfile } = require('../control/user')
const { isLogin } = require('../middlare/verif')
const router = express.Router()

router
.get('/myprofile', isLogin, getProfile)

module.exports = router