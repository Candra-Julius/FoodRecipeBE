const pool = require('../config/pg')

const authModel = {
    regist: (data) =>{
        return pool.query('INSERT INTO users (user_id, email, phone, password, name, status) VALUES($1, $2, $3, $4, $5, $6)',[data.id, data.email, data.phone, data.hash, data.name, data.status])
    },
    emailCheck: (email) =>{
        return pool.query('SELECT * FROM users WHERE email = $1', [email])
    },
    activated: (id) =>{
        return pool.query('UPDATE users SET status = 1 WHERE user_id = $1', [id])
    },
    checkEmail: (email)=>{
        return pool.query('SELECT * FROM users WHERE email = $1', [email])
    }
}

module.exports = authModel