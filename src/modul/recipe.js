const pool = require('../config/pg')

const recipeModule ={
    addNewRecipe: (data)=>{
        return pool.query(
            'INSERT INTO td_recipe (id_user, recipe_name, ingredient, id_recipe, created_at) VALUES( $1, $2, $3, $4, $5)',
        [
            data.id_user, 
            data.recipe_name, 
            data.ingredient, 
            data.id_recipe, 
            data.created_at
        ])
    },
    recipeImage: (resImage, id_recipe)=>{
        return pool.query(
            'UPDATE td_recipe SET recipe_images = $1, cloudinary_public_id = $2 WHERE id_recipe = $3', [resImage.secure_url, resImage.cloudinary_public_id, id_recipe]
        )
    },
    recipeVideo: (data)=>{
        return pool.query(
            'INSERT INTO td_video (id_video, id_recipe, video_url, title, part_order, cloudinary_public_id) VALUES($1, $2, $3, $4, $5, $6)',
        [
            data.id_video,
            data.id_recipe, 
            data.video_url,
            data.title,
            data.part_order,
            data.cloudinary_public_id,
        ])
    },
    checkRecipe: (id)=>{
        return pool.query('SELECT * FROM td_recipe WHERE id_recipe = $1', [id])
    },
    deleteRecipe: (id)=>{
        return pool.query('DELETE FROM td_recipe WHERE id_recipe = $1', [id])
    },
    getVideoRecipe: (id_recipe)=>{
        return pool.query('SELECT * FROM td_video WHERE id_recipe = $1', [id_recipe])
    },
    getAllRecipe: (limit, offset)=>{
        return pool.query(`SELECT * FROM td_recipe LIMIT ${limit} OFFSET ${offset}`)
    },
    searchRecipe: (limit, offset, search)=>{
        return pool.query(`SELECT * FROM td_recipe WHERE recipe_name = '${search}' LIMIT ${limit} OFFSET ${offset}`)
    },
    countRecipe: () => {
        return pool.query('SELECT COUNT(*) AS total FROM td_recipe')
    },
    countSearchRecipe: (search) => {
        return pool.query('SELECT COUNT(*) AS total FROM td_recipe WHERE id_recipe = $1', [search])
    },
    editRecipe: (data) => {
        return pool.query('UPDATE td_recipe SET recipe_name = $1, recipe_images = $2, ingredient = $3, cloudinary_public_id = $4, updated_at = $5 WHERE id_recipe = $6', 
        [
            data.recipe_name, 
            data.image, 
            data.ingredient, 
            data.cloudinary_public,
            data.updated_at, 
            data.id
        ])
    },
}

module.exports = recipeModule