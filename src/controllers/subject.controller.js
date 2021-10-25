const { Subject } = require("../database/sequelize")


/*********************************************************************
 *  Show all subjects
 * 
 */
module.exports.getAll = async (req, res) => {
    const subject = await Subject.findAll()

    res.status(200).send(subject)
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
    try {
        const newSubject = await Subject.create({
            short: short,
            name: name,
            year: year,
            FacultyName: faculty
        })
        return res.status(200).send(newSubject)
    } catch (e) {
        return res.status(401).send(e)
    }

}