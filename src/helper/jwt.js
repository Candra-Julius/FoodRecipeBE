const JWT = require('jsonwebtoken')

const webToken = {
    generateToken: (payload) => {
        const expiresIn = {
            expiresIn: '43200000ms',
            issuer: 'FoodRecipe'
        }
        const token = JWT.sign(payload, process.env.SECRET_KEY_JWT, expiresIn)
        return token
    },
    generateRefreshToken: (payload) => {
        const expiresIn = {
            expiresIn: '1 day',
            issuer: 'FoodRecipe'
        }
        const token = JWT.sign(payload, process.env.SECRET_KEY_JWT, expiresIn)
        return token
    },
}

module.exports = webToken