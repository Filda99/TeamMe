/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                      Check subject and faculty                                    
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Check that subject really exists in our system.
 *      Check same for faculty
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const { Subject, Faculty } = require("../database/sequelize");


async function checkFaculty(faculty) {
    /** Check subject exists */
    const facultyExists = await Faculty.findAll({
        where: {
            id: faculty
        }
    })
    if (!facultyExists.length) {
        return 0
    }
    return 1
}


async function checkSubject(subject, faculty) {
    /** Check subject exists */
    console.log(faculty);
    const subjectExists = await Subject.findAll({
        where: {
            id: subject,
            FacultyId: faculty
        }
    })
    if (!subjectExists.length) {
        return 0
    }
    return 1
}

module.exports = {
    checkSubject,
    checkFaculty
}