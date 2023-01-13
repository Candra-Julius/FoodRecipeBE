const express = require('express')
const { getAllRecipe } = require('../controller/recipe/recipe.controler')
const router = express.Router()
const auth = require('./auth')
const recipe = require('./recipe')
const users = require('./user')

router
.get('/home', getAllRecipe)
.use('/', auth)
.use('/recipe', recipe)
.use('/users', users)

module.exports = router