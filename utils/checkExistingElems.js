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
    try{
        faculty = Number(faculty)
    }catch(e){
        return 0
    }
    if(typeof faculty !== "number"){
        return 0
    }
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
    try{
        subject = Number(subject)
    }catch(e){
        return 0
    }
    if(typeof subject !== "number"){
        return 0
    }
    /** Check subject exists */
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