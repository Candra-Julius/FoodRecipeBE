const express = require('express')
const { addNewRecipe, deleteRecipe, detailRecipe, updateRecipe } = require('../controller/recipe/recipe.controler')
const { upload } = require('../helper/fileHandler')
const { isLogin } = require('../middlare/verif')
const router = express.Router()

router
.post('/new', isLogin, upload.fields(
    [
        {name: 'image', maxCount:1},
        {name: 'video', maxCount:1}
    ]
), addNewRecipe)
.delete('/delete/:id', isLogin, deleteRecipe)
.get('/detail/:id', detailRecipe)
.put('/edit/:id', isLogin, upload.single('image'), updateRecipe)

module.exports = router