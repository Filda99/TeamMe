/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                      Get teams by name or id                                    
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Get team by name or id
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const { Op } = require("sequelize")
const { Team } = require("../database/sequelize")

async function getAllTeamsToShow(subject) {
    return await Team.findAll({
        where: {
            SubjectId: subject,
            visible: {
                [Op.ne]: 2
            },
        }
    })
}

async function getTeamByName(name, subject) {
    try {
        return await Team.findOne({
            where: {
                name: name,
                SubjectId: subject
            }
        })
    } catch (e) {
        return e
    }
}

async function getTeamById(id) {
    try {
        return await Team.findOne({
            where: {
                id: id,
            }
        })
    } catch (e) {
        return e
    }
}

module.exports = {
    getTeamByName,
    getTeamById,
    getAllTeamsToShow
}