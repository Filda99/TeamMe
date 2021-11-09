const { Faculty } = require("../database/sequelize");
const { getUserNotifi } = require("./notification.controller");


/*********************************************************************
 *  Show all faculties.
 * 
 */
module.exports.getAll = async (req, res) => {
    const faculties = await Faculty.findAll()

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('faculties', { userLogged, notification })
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
