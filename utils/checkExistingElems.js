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

const { getUserNotifi } = require("../controllers/notification.controller");
const { Subject, Faculty } = require("../database/sequelize");

async function starterCheck(req, res, faculty, subject) {
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    if (faculty) {
        /** Check that faculty exists */
        try {
            if (!await checkFaculty(faculty)) {
                const message = 'Entered faculty does not exists!'
                return res.status(403).render('error', { message, userLogged, notification });
            }
        }
        catch (e) {
            return res.status(403).render('error', { e });
        }
    }

    if (subject) {
        /** Check that subject exists */
        try {
            if (!await checkSubject(subject, faculty)) {
                const message = 'Entered subject does not exists!'
                return res.status(403).render('error', { message, userLogged, notification });
            }
        }
        catch (e) {
            return res.status(403).render('error', { e });
        }
    }
}

async function checkFaculty(faculty) {
    try {
        faculty = Number(faculty)
        if (!faculty)
            return 0
    } catch (e) {
        return 0
    }
    if (typeof faculty !== "number") {
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
    try {
        subject = Number(subject)
        if (!subject)
            return 0
    } catch (e) {
        return 0
    }
    if (typeof subject !== "number") {
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
    starterCheck,
    checkFaculty,
    checkSubject
}