const pool = require('../config/pg')

const userModule = {
    detailProfile: (id) => {
        return pool.query('SELECT * FROM users WHERE user_id = $1', [id])
    },
    myRecipe: (id) => {
        return pool.query('SELECT * FROM recipe WHERE user_id = $1', [id])
    }
}

module.exports = userModule