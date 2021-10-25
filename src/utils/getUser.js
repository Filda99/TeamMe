const { User } = require("../database/sequelize")

async function getUserById(id) {
    try{
        return await User.findOne({
            attributes: [
                'id',
                'email',
                'login',
                'yearOfStudy',
                'FacultyName'
            ],
            where: {
                id: id,
            }
        })
    }catch(e){
        return e
    }
}

async function getUserByEmail(email) {
    try{
        return await User.findOne({
            attributes: [
                'id',
                'email',
                'login',
                'yearOfStudy',
                'FacultyName'
            ],
            where: {
                email: email,
            }
        })
    }catch(e){
        return e
    }
}

async function getUserPassById(id) {
    return await User.findOne({
        attributes: ['password'],
        where: {
            id: id,
        }
    })
}



module.exports = {
    getUserByEmail,
    getUserById,
    getUserPassById
}