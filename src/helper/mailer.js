const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 8000 
let URL =''
if(process.env.PROJECT_ENV === 'PRODUCTION'){
    URL = 'https://long-underwear-toad.cyclic.app/'
}else {
    URL = `http://localhost:${PORT}`
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
    user: 'candrajulius24@gmail.com',
    pass: process.env.GMAIL_APP_PASS
    }
})

const sendEmail = {
    Activation: async(data) =>{
        const token = jwt.sign(data, process.env.SECRET_KEY_JWT, {
            expiresIn: '100 Days'
        })
        const info = await transporter.sendMail({
            from:'"FoodRecipe" <candrajulius24@gmail.com>',
            to: data.email,
            subject: 'User Activation',
            text: `${URL}/activate/${token}/${data.id}`
        })
        console.log('Message sent: %s', info.messageId)
    }
}
module.exports = sendEmail