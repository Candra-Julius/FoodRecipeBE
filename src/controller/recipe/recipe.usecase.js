const { v4: uuidv4 } = require('uuid');
const uploadFile = require("../../helper/cloudinary")
const { addNewRecipe, recipeImage, recipeVideo } = require("../../modul/recipe")
const moment = require("moment");
const createHttpError = require('http-errors');

const date = moment(new Date().getTime()).format()

const newRecipe = async (data, files, next) => {
    try {
        data.id_recipe = uuidv4()
        data.created_at = date
        console.log(data)
        await addNewRecipe(data)
        if(Object.keys(files) != 0){
            console.log(data)
            const res = await fileUploader(files, data, next)
            data.file = res
        }
        return data
    } catch (error) {
        console.log(error)
        next(createHttpError[500]())
    }
}

const fileUploader = async(files, data, next) => {
    try {
        let file = {
            image: undefined,
            videos: undefined
        }
        if (files.video) {
            const [filesVid] = files.video 
            const resVid = await uploadFile(filesVid)
            const datas = {
                id_video: uuidv4(),
                id_recipe: data.id_recipe,
                video_url: resVid.secure_url,
                cloudinary_public_id: resVid.cloudinary_public_id,
                title: data.title,
                part_order: data.part_order,
                created_at: data.created_at
            }
            await recipeVideo(datas)
            file.videos = resVid
        } else if (files.image) {
            const [filesImg] = files.image
            const resImg =  await uploadFile(filesImg)
            console.log(resImg)
            console.log(data.id_recipe)
            await recipeImage(resImg, data.id_recipe)
            file.image = resImg
        }
        return file
    } catch (error) {
        console.log(error)
        next(createHttpError[500]())
    }
}

module.exports = {
    newRecipe,
    fileUploader
}