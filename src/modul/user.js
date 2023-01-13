const pool = require('../config/pg')

const userModule = {
    detailProfile: (id) => {
        return pool.query('SELECT profile_picture, name, email, created_at FROM td_user WHERE id_user = $1', [id])
    },
    myRecipe: (id) => {
        return pool.query('SELECT * FROM td_recipe WHERE id_user = $1', [id])
    }
}

module.exports = userModule