const { Subject } = require("../database/sequelize")
const { checkFaculty } = require('../utils/checkExistingElems')


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


    const subject = await Subject.findAll({
        where: {
            FacultyId: faculty
        }
    })

    console.log(subject);
    res.render('subjects')
}


/*********************************************************************
 *  Create new subject
 * 
 */
module.exports.createNew = async (req, res) => {
    const { short, name, year } = req.body
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
            name: name,
            year: year,
            FacultyId: faculty
        })
        return res.status(200).send(newSubject)
    } catch (e) {
        return res.status(401).send(e)
    }

}