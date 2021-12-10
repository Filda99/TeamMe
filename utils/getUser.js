/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                      Get user by name or id                                    
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Get user by name or id
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const { User } = require("../database/sequelize")
const { getFacultybyId } = require("./getFacultySubject")

async function getUserById(id) {
    try{
        const user = await User.findOne({
            attributes: [
                'id',
                'email',
                'login',
                'yearOfStudy',
                'FacultyId',
                'communicationChannel',
                'approach',
                'workingHours',
                'workingDays'
            ],
            where: {
                id: id,
            }
        })
        const userFaculty = await getFacultybyId(user.FacultyId)
        return user
    }catch(e){
        return e
    }
}

async function getUserByEmail(email) {
    try{
        const user = await User.findOne({
            attributes: [
                'id',
                'email',
                'login',
                'yearOfStudy',
                'FacultyId',
                'workingHours',
                'workingDays',
                'approach',
                'communicationChannel'
            ],
            where: {
                email: email,
            }
        })
        return user
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