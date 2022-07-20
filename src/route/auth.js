const express = require('express')
const router = express.Router()
const authControl = require('../control/auth')
const { upload } = require('../helper/fileHandler')
const { isLogin } = require('../middlare/verif')

router
.post('/register', upload.none(), authControl.regist)
.get('/activate/:token/:id', authControl.active)
.post('/login', upload.none(), authControl.login)
.get('/logout', isLogin, authControl.logout)


module.exports = router