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

async function returnFacultyBySubject(subjectId){
    const subject = await Subject.findOne({
        where: {
            id: subjectId
        }
    })
    return subject.FacultyId
}

async function getFacultyNameById(facultyId){
    const facultyName = await Faculty.findOne({
        where:{
            id: facultyId
        }
    })
    return facultyName.short
}

async function getSubjectNameById(subjectId){
    const subjectName = await Subject.findOne({
        where:{
            id: subjectId
        }
    })
    return subjectName.short
}

module.exports = {
    getFaculty,
    getFacultybyId,
    returnFacultyBySubject,
    getFacultyNameById,
    getSubjectNameById
}