const express = require('express')
const { getAllRecipe } = require('../control/recipe')
const router = express.Router()
const auth = require('./auth')
const recipe = require('./recipe')

router
.get('/home', getAllRecipe)
.use('/', auth)
.use('/recipe', recipe)

module.exports = router