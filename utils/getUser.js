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

async function getUserById(id) {
    try{
        return await User.findOne({
            attributes: [
                'id',
                'email',
                'login',
                'yearOfStudy',
                'FacultyId'
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
                'FacultyId'
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