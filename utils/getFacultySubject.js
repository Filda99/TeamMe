/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                      Get Subject or Faculty                                   
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Get faculty od subject id by name
 *          -> used in registration etc...
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */


const { Subject, Faculty } = require("../database/sequelize");

async function getFaculty(name) {
    /** Check subject exists */
    const facultyExists = await Faculty.findOne({
        where: {
            short: name
        }
    })
    console.log(facultyExists);
    if (!facultyExists) {
        return 0
    }
    return facultyExists

}

async function getFacultybyId(id) {
    /** Check subject exists */
    const facultyExists = await Faculty.findOne({
        where: {
            id: id
        }
    })
    if (!facultyExists) {
        return 0
    }
    return facultyExists
}

module.exports = {
    getFaculty,
    getFacultybyId
}