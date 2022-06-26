const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { Activation } = require('../helper/mailer')
const { emailCheck, regist, activated, checkEmail } = require('../modul/auth')
const bcrypt = require('bcryptjs')
const webToken = require('../helper/jwt')


const authControl = {
    regist: async(req, res, next) =>{
    try {
        const {email, phone, password, name} = req.body
        const {rowCount: emailExist} = await emailCheck(email)
        const salt = bcrypt.genSaltSync(13)
        const hash = bcrypt.hashSync(password,salt)
        const data = {
            id: uuidv4(),
            name,
            email,
            phone,
            hash,
            status: 0
        }
        if(emailExist){
            res.status(200).json({
                message: 'Email already taken'
            })
        }else{
            
            await regist(data)
            res.status(403).json({
                message:'Registration success, please check your email',
                data
            })
            Activation(data)
        }
    } catch (error) {
        console.log(error);
        next(createError[500]())
    }
    },
    active: async(req, res, next) =>{
        try {
            const id = req.params.id
            await activated(id)
            res.status(200).json({
                message:'success'
            })
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    },
    login: async(req, res, next) =>{
        try { 
        const {email, password} = req.body
        const {rowCount: emailCheck, rows: [data]} = await checkEmail(email)
        console.log(data);
        const validate =  bcrypt.compareSync(password, data.password)
        
        if(!validate || !emailCheck){
            res.status(406).json({
                message: 'Email or Password incorect'
            })
        }else{
            const payload = {
                id: data.user_id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                status: data.status
            }
            if(!payload.status){
                res.status(403).json({
                    message: 'Please check your email to verify your account'
                })
            }else{
                const token = webToken.generateToken(payload)
                payload.token = token
                const refreshToken= webToken.generateRefreshToken(payload)
                payload.refreshToken = refreshToken
                delete data.password
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 12,
                    secure: false,
                    path: "/",
                    sameSite: 'strict',

                })
                res.status(200).json({
                    message: `Wellcome back ${payload.name}`,
                    payload
                })
            }
        }
            
        } catch (error) {
        next(createError[500]())   
        }
    }
}
module.exports = authControl