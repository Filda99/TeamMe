const { Subject } = require("../database/sequelize")
const { starterCheck } = require('../utils/checkExistingElems')
const { getUserNotifi } = require('../controllers/notification.controller')
const { getUserById } = require("../utils/getUser")

/*********************************************************************
 *  Show all subjects
 * 
 */
module.exports.getAll = async (req, res) => {
    const { faculty } = req.params
    const { year, subjectType } = req.query
    if (!faculty) {
        res.status(401).send('Nejdříve zadejte fakultu.')
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty)

    let subjectArray = new Array()

    const subjects = await Subject.findAll({
        where: {
            FacultyId: faculty,
        }
    })

    if(!year && !subjectType){
        subjectArray = subjects
    }
    else if (year && !subjectType) {
        subjects.forEach((subject) => {
            if (subject.year == year)
                subjectArray.push(subject)
        })
    }
    else if(subjectType && !year){
        subjects.forEach((subject) => {
            if (subject.compulsory == subjectType)
                subjectArray.push(subject)
        })
    }
    else{
        subjects.forEach((subject) => {
            if (subject.compulsory == subjectType &&
                subject.year == year)
                subjectArray.push(subject)
        })
    }

    let userLogged = false
    let userFaculty = null;
    let notification = null;
    if (req.user) {
        userLogged = true
        userFaculty = await getUserById(req.user.id)
        userFaculty = userFaculty.FacultyId
        notification = await getUserNotifi(req.user.id)
    }

    res.render('subjects', { subjectArray, faculty, userLogged, notification, userFaculty })
}


/*********************************************************************
 *  Create new subject
 * 
 */
module.exports.createNew = async (req, res) => {
    const { short, year, specialization, compulsory } = req.body
    const { faculty } = req.params
    if (!faculty) {
        res.status(401).send('Nejdřív zadejte fakultu.')
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty)

    try {
        const newSubject = await Subject.create({
            short: short,
            year: year,
            specialization: specialization,
            compulsory: compulsory,
            FacultyId: faculty
        })
        return res.status(200).send(newSubject)
    } catch (e) {
        return res.status(401).send(e)
    }

}