const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid');
const uploadFile = require('../../helper/cloudinary');
const { 
    checkRecipe, 
    deleteRecipe, 
    getAllRecipe, 
    countRecipe, 
    searchRecipe, 
    countSearchRecipe, 
    getVideoRecipe, 
    editRecipe,  
} = require('../../modul/recipe');
const { newRecipe } = require('./recipe.usecase');
const moment = require("moment")
const  cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const date = moment(new Date().getTime()).format()

const reciptControl = {
    addNewRecipe: async(req, res, next)=>{
        try {
            const data = {
                id_user: req.payload.id,
                recipe_name: req.body.recipe_name, 
                ingredient: req.body.ingredient, 
                title: req.body.title,
                part_order: req.body.part_order
            }
            const files = req.files
            console.log(req.body)
            const datas = await newRecipe(data, files, next)

            res.status(200).json({
                message: 'new recipe added',
                data: datas
            })
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    },
    deleteRecipe: async(req, res, next)=>{
        try {
            const id = req.params.id
            const {rowCount: recipe, rows} = await checkRecipe(id)
            if (recipe){
                console.log(`rows`, rows)
                const [publicId] = rows.map( e => e.cloudinary_public_id)
                console.log(publicId)
                await cloudinary.uploader.destroy(publicId)
                await deleteRecipe(id)
                res.status(200).json({
                    message: 'success',
                    rows
                })
            }else{
                res.status(200).json({
                    message: 'item doesnt exist'
                })
            }
        } catch (error) {
            console.log(error)
            next(createError[500]())
        }
    },
    getAllRecipe: async(req,res,next)=>{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit
        const sortby = req.query.sortby
        const search = req.query.search
        if(search){
            const {rows: hasil} = await searchRecipe(limit, offset, search)
            const { rows: [count] } = await countSearchRecipe(search)
            const totalData = parseInt(count.total)
            totalPage = Math.ceil(totalData / limit)
            const pagination = {
                currentPage: page,
                limit,
                totalData,
                totalPage,
            }
        res.status(200).json({
            message: 'success',
            pagination,
            hasil
        })
        }else{
            const {rows: hasil} = await getAllRecipe(limit, offset)
            const { rows: [count] } = await countRecipe()
            const totalData = parseInt(count.total)
            totalPage = Math.ceil(totalData / limit)
            const pagination = {
                currentPage: page,
                limit,
                totalData,
                totalPage,
            }
        res.status(200).json({
            message: 'success',
            pagination,
            hasil
        })
        }
    },
    detailRecipe: async(req, res, next)=>{
        const id = req.params.id
        const {rowCount: recipe, rows: [hasil]} = await checkRecipe(id)
        if(!recipe){
            res.status(200).json({
                message: 'recipe not found',
            })
        }else{
            const {rows: videos} = await getVideoRecipe(id)
            console.log(videos);
            const data = {
                ...hasil,
                videos
            }
            res.json({
                data
            })
        }
    },
    updateRecipe: async(req, res, next)=>{
        try {
            const {id} = req.params
            const {recipe_name, ingredient} = req.body
            console.log(req.body)
            const {rows: [datas]} = await checkRecipe(id) 
            const data = {
                id,
                recipe_name,
                ingredient,
                image: null|| datas.recipe_images,
                cloudinary_public: null || datas.cloudinary_public_id,
                updated_at: date
            }
            if(req.file){
                const image = await uploadFile(req.file)
                data.image = image.secure_url
                data.cloudinary_public = image.cloudinary_public_id
            }
                await editRecipe(data)
                console.log(data);
                res.status(200).json({
                    message: 'updated',
                    data
                })
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    }
}

module.exports = reciptControl