const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid');
const { addNewRecipe, recipeVideo, checkRecipe, deleteRecipe, getAllRecipe, countRecipe, searchRecipe, countSearchRecipe, getVideoRecipe, editRecipeWithImg, editRecipeWoImg } = require('../modul/recipe');
const  cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const reciptControl = {
    addNewRecipe: async(req, res, next)=>{
        try {
            const userID = req.payload.id
            const {name, ingridient, title} = req.body
            if (req.files.video && req.files.image){
                console.log('semua ada');
            const [fileVid] = req.files.video
            const [fileImg] = req.files.image
            const image = await cloudinary.uploader.upload(fileImg.path)
            const video = await cloudinary.uploader.upload(fileVid.path, {resource_type: "video"})
            const data = {
                userID,
                name,
                ingridient,
                image: image.secure_url,
                video: video.secure_url,
                title,
                id: uuidv4()
            }
            console.log(data);
            await addNewRecipe(data)
            await recipeVideo(data)
            res.status(200).json({
                message: 'New Recipe Added',
                data
            })
            }else if(req.files.image && !req.files.video){
                console.log('cuma gambar');
                const [fileImg] = req.files.image
            const image = await cloudinary.uploader.upload(fileImg.path)
            const data = {
                userID,
                name,
                ingridient,
                image: image.secure_url,
                title,
                id: uuidv4()
            }
            console.log(data);
            await addNewRecipe(data)
            res.status(200).json({
                message: 'New Recipe Added',
                data
            })
            }else if (!req.files.image && req.files.video){
                console.log('cuma vid');
                const [fileVid] = req.files.video
            const video = await cloudinary.uploader.upload(fileVid.path, {resource_type: "video"})
            const data = {
                userID,
                name,
                ingridient,
                video: video.secure_url,
                title,
                id: uuidv4()
            }
            console.log(data);
            await addNewRecipe(data)
            await recipeVideo(data)
            res.status(200).json({
                message: 'New Recipe Added',
                data
            })
            }else{
                console.log('ga ada');
            const data = {
                userID,
                name,
                ingridient,
                title,
                id: uuidv4()
            }
            console.log(data);
            await addNewRecipe(data)
            res.status(200).json({
                message: 'New Recipe Added',
                data
            })
            }
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    },
    deleteRecipe: async(req, res, next)=>{
        const id = req.params.id
        const {rowCount: recipe, rows} = await checkRecipe(id)
        console.log(recipe);
        if (recipe){
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
            const {name, ingridient} = req.body
            if(req.file){
                const fileImg = req.file
                const image = await cloudinary.uploader.upload(fileImg.path)
                const data = {
                    id,
                    name,
                    ingridient,
                    image: image.secure_url
                }
                await editRecipeWithImg(data)
                console.log(data);
                res.status(200).json({
                    message: 'updated',
                    data
                })
            }else{
                const data = {
                    id,
                    name,
                    ingridient,
                }
                await editRecipeWoImg(data)
                res.status(200).json({
                    message: 'updated',
                    data
                })
            }
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    }
}

module.exports = reciptControl