const createError = require('http-errors')
const { detailProfile, myRecipe } = require('../modul/user')

const usersControler = {
    getProfile: async(req, res, next) => {
        try {
            console.log("masuk ke getProfile");
            const id = req.payload.id
            console.log(`id: ${id}`);
            const {rows: [profile]} = await detailProfile(id)
            console.log(`profile: ${profile}`);
            const {rows: recipe} = await myRecipe(id)
            console.log(`recipe: ${recipe}`);
            const data ={
                ...profile,
                recipe
            }
            res.status(200).json({
                message: "success",
                data
            })
        } catch (error) {
            console.log(error);
            next(createError[500]())
        }
    }
}

module.exports = usersControler