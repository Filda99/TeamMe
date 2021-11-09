const { Subject } = require("../database/sequelize")
const { checkFaculty } = require('../utils/checkExistingElems')
const { getUserNotifi } = require('../controllers/notification.controller')

/*********************************************************************
 *  Show all subjects
 * 
 */
module.exports.getAll = async (req, res) => {
    const { faculty } = req.params
    if (!faculty) {
        res.status(401).send('Insert faculty first')
    }
    /** Check that faculty exists */
    if (!await checkFaculty(faculty)) {
        return res.status(403).send({
            message: 'This faculty does not exists!',
        });
    }


    const subjects = await Subject.findAll({
        where: {
            FacultyId: faculty
        }
    })

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }
    
    res.render('subjects', {subjects, faculty, userLogged, notification})
}


/*********************************************************************
 *  Create new subject
 * 
 */
module.exports.createNew = async (req, res) => {
    const { short, year, specialization, compulsory } = req.body
    const { faculty } = req.params
    if (!faculty) {
        res.status(401).send('Insert faculty first')
    }
    /** Check that faculty exists */
    if (!await checkFaculty(faculty)) {
        return res.status(403).send({
            message: 'This faculty does not exists!',
        });
    }

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