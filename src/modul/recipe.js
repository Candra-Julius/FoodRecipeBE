const pool = require('../config/pg')

const recipeModule ={
    addNewRecipe: (data)=>{
        return pool.query('INSERT INTO recipe (user_id, recipe_name, ingridient, recipe_id, pict) VALUES( $1, $2, $3, $4, $5)',[data.userID, data.name, data.ingridient, data.id, data.image])
    },
    recipeVideo: (data)=>{
        return pool.query('INSERT INTO video (recipe_id, url, title) VALUES($1, $2, $3)',[data.id, data.video, data.title])
    },
    checkRecipe: (id)=>{
        return pool.query('SELECT * FROM recipe WHERE recipe_id = $1', [id])
    },
    deleteRecipe: (id)=>{
        return pool.query('DELETE FROM recipe WHERE recipe_id = $1', [id])
    },
    getVideoRecipe: (recipe_id)=>{
        return pool.query('SELECT * FROM video WHERE recipe_id = $1', [recipe_id])
    },
    getAllRecipe: (limit, offset)=>{
        return pool.query(`SELECT * FROM recipe LIMIT ${limit} OFFSET ${offset}`)
    },
    searchRecipe: (limit, offset, search)=>{
        return pool.query(`SELECT * FROM recipe WHERE recipe_name = '${search}' LIMIT ${limit} OFFSET ${offset}`)
    },
    countRecipe: () => {
        return pool.query('SELECT COUNT(*) AS total FROM recipe')
    },
    countSearchRecipe: (search) => {
        return pool.query('SELECT COUNT(*) AS total FROM recipe WHERE recipe_id = $1', [search])
    },
    editRecipeWithImg: (data) => {
        return pool.query('UPDATE recipe SET recipe_name = $1, pict = $2, ingridient = $3 WHERE recipe_id = $4', [data.name, data.image, data.ingridient, data.id])
    },
    editRecipeWoImg: (data) => {
        return pool.query('UPDATE recipe SET recipe_name = $1, ingridient = $2 WHERE recipe_id = $3', [data.name, data.ingridient, data.id])
    }
}

module.exports = recipeModule