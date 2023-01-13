const createHttpError = require('http-errors');

const  cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

 const uploadFile = async(file) => {
    if(file.mimetype === 'video/mp4' | file.mimetype == 'video/mkv'){
        const video = await cloudinary.uploader.upload(file.path,{resource_type: 'video'})
        const dataFile = {
            secure_url: video.secure_url,
            cloudinary_public_id: video.public_id
        }
        return dataFile
    }else{
        const images = await cloudinary.uploader.upload(file.path)
        const dataFile = {
            secure_url: images.secure_url,
            cloudinary_public_id: images.public_id
        }
        return dataFile

    }
}

module.exports = uploadFile