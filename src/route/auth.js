const express = require('express')
const router = express.Router()
const authControl = require('../control/auth')
const { upload } = require('../helper/fileHandler')

router
.post('/register', upload.none(), authControl.regist)
.get('/activate/:token/:id', authControl.active)
.post('/login', upload.none(), authControl.login)


module.exports = router