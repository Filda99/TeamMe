const e = require('express')
let router = e.Router()
const team = require('../controllers/team.controller')
const { checkAuthenticated } = require('../utils/isAuthenticated')

/** Show all teams based on properties */
router.get('/', team.showTeams)

/** Get team info */
router.get('/:subject/info/:id', team.getTeam)

/** Get list of my teams */
router.get('/myTeams', checkAuthenticated, team.getMyTeams)

/** Create new team */
router.post('/:subject/createTeam', checkAuthenticated, team.createTeam)

/** Connect to the team */
router.post('/:subject/conn/:teamName', checkAuthenticated, team.connect)

/** Disconnect from a team */
router.post('/:subject/disconn/:teamName', checkAuthenticated, team.disconnect)

/** Delete team - by team admin */
router.post('/:subject/delete/:name', checkAuthenticated, team.deleteTeam);

/** Update team infos - by team admin */
router.post('/:subject/update/:id', checkAuthenticated, team.updateTeam);

/** Kick other member - by team admin */
router.post('/:subject/kickMember/:email', checkAuthenticated, team.kickMember)
module.exports = router;
