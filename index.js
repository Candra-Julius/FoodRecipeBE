require("dotenv").config();
const express = require('express')
const createError = require('http-errors')
const main = require('./src/route/main')
const cors = require("cors");
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8000
const app = express()




app.use(express())
app.use(cookieParser())
app.use(express.json())
app.use(
    cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
    origin: '*'
    })
);


//route
app.use('/', main)

//error handling
app.use('*', (req, res, next)=>{
    next(new createError[404]())
})

app.use((err, req, res, next)=>{
    const messError = err.message
    const errStatus = err.status

    res.status(errStatus).json({
        message: messError
    })
})

app.listen(PORT, ()=>{
    console.log(`server runing port: ${PORT}`);
})