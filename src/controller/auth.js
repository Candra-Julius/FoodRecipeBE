const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { Activation } = require('../helper/mailer')
const { emailCheck, registration, emailVerification } = require('../modul/auth')
const bcrypt = require('bcryptjs')
const webToken = require('../helper/jwt')
const moment = require("moment")


const authControl = {
    registration: async(req, res, next) =>{
    try {
        const {email, password, name, phone} = req.body
        const {rowCount: emailExist} = await emailCheck(email)
        const salt = bcrypt.genSaltSync(13)
        const hash = bcrypt.hashSync(password,salt)
        const date = moment(new Date().getTime()).format()
        const data = {
            id: uuidv4(),
            name,
            email,
            phone,
            hash,
            flag_active: false,
            created_at: date
        }
        if(emailExist){
            res.status(200).json({
                message: 'Email already taken'
            })
        }else{
            
            await registration(data)
            delete data.hash
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
    emailVerification: async(req, res, next) =>{
        try {
            const id = req.params.id
            await emailVerification(id)
            res.redirect('https://google.com')
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    },
    login: async(req, res, next) =>{
        try { 
        const {email, password} = req.body
        const {rowCount, rows: [data]} = await emailCheck(email)
        if(!rowCount){
            res.status(403).json({
                message: 'Email doesnt exist'
            })
            return
        }
        const validate =  bcrypt.compareSync(password, data.password)
        if(!validate){
            res.status(403).json({
                message: 'Email or Password incorect'
            })
        }else{
            const payload = {
                id: data.id_user,
                name: data.name,
                email: data.email,
                isLogin: true
            }
            if(!data.flag_active){
                res.status(401).json({
                    message: 'Please check your email to verify your account'
                })
            }else{
                const token = webToken.generateToken(payload)
                payload.token = token
                const refreshToken= webToken.generateRefreshToken(payload)
                payload.refreshToken = refreshToken
                // res.cookie('token', token, {
                //     httpOnly: true,
                //     maxAge: 43200000,
                //     secure: true,
                //     path: "/",
                //     sameSite: 'none',
                // })
                res.status(200).json({
                    message: `Wellcome back ${payload.name}`,
                    payload
                })
            }
        }
            
        } catch (error) {
            console.log(error);
        next(createError[500]())   
        }
    },
    logout: (req, res, next) => {
        console.log('mulai logout');
        // const payload = {
        //     logout: true
        // }
        // console.log(token);
        // res.cookie('token', payload, {
        //     httpOnly: true,
        //     maxAge: 10,
        //     secure: true,
        //     path: "/",
        //     sameSite: 'none',
        // })
        res.status(200).json({
            message: 'logout success'
        })
        console.log('logout selesai');
    }
}
module.exports = authControl