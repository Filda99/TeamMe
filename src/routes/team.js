const e = require('express')
let router = e.Router()
const team = require('../controllers/team.controller')
const {checkAuthenticated} = require('../utils/isAuthenticated')

/** Show all teams based on properties */
router.get('/', team.showTeams)

/** Get team info */
router.get('/:id', team.getTeam)

/** Create new team */
router.post('/createTeam', checkAuthenticated, team.createTeam)

/** Connect to the team */
router.post('/conn/:teamID',  checkAuthenticated, team.connect)
// router.post('/delete', user.deleteTeam);

// router.post('/update/:id', user.updateTeam);

module.exports = router;
