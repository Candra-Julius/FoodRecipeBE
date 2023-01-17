const pool = require('../config/pg')

const authModel = {
    registration: (data) =>{
        return pool.query('INSERT INTO td_user (id_user, email, password, name, flag_active, created_at, phone) VALUES($1, $2, $3, $4, true, $5, $6)',
        [
            data.id, 
            data.email, 
            data.hash, 
            data.name, 
            data.created_at,
            data.phone
        ])
    },
    emailCheck: (email) =>{
        return pool.query('SELECT * FROM td_user WHERE email = $1', [email])
    },
    emailVerification: (id) =>{
        return pool.query('UPDATE td_user SET flag_active = true WHERE id_user = $1', [id])
    },
}

module.exports = authModel