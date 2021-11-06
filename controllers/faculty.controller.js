const { Faculty } = require("../database/sequelize")


/*********************************************************************
 *  Show all faculties.
 * 
 */
module.exports.getAll = async (req, res) => {
    const faculties = await Faculty.findAll()

    res.render('faculties')
}


/*********************************************************************
 *  Create new faculty.
 * 
 */
module.exports.createNew = async (req, res) => {
    const { short, name } = req.body
    try {
        const newFaculty = await Faculty.create({
            short: short,
            name: name
        })
        res.status(200).send(newFaculty)
    } catch (e) {
        return res.status(401).send(e)
    }
}
