const { Team } = require("../database/sequelize")

async function getTeamByName(name) {
    try{
        return await Team.findOne({
            where: {
                name: name,
            }
        })
    }catch(e){
        return e
    }
}

async function getTeamById(id) {
    try{
        return await Team.findOne({
            where: {
                id: id,
            }
        })
    }catch(e){
        return e
    }
}

module.exports = {
    getTeamByName,
    getTeamById
}