const e = require('express')
let router = e.Router()
const team = require('../controllers/team.controller')
const { checkAuthenticated } = require('../utils/isAuthenticated')

/** Show all teams based on properties */
router.get('/:faculty/:subject/', team.showTeams)

/** Get team info */
router.get('/:faculty/:subject/info/:name', team.getTeam)

/** Get list of my teams */
router.get('/myTeams', checkAuthenticated, team.getMyTeams)

/** Create new team form */
router.get('/:faculty/:subject/create', checkAuthenticated, team.createTeamForm)

/** Update team form */
router.get('/:faculty/:subject/form/update/:name', checkAuthenticated, team.updateTeamForm)

/** Create new team */
router.post('/:faculty/:subject/createTeam', checkAuthenticated, team.createTeam)

/** Connect to the team */
router.post('/:faculty/:subject/conn/:teamName', checkAuthenticated, team.connect)

/** Disconnect from a team */
router.post('/:faculty/:subject/disconn/:teamName', checkAuthenticated, team.disconnect)

/** Delete team - by team admin */
router.post('/:faculty/:subject/delete/:teamName', checkAuthenticated, team.deleteTeam);

/** Update team infos - by team admin */
router.post('/:faculty/:subject/update/:teamId', checkAuthenticated, team.updateTeam);

/** Kick other member - by team admin */
router.post('/:faculty/:subject/kickMember/:teamName', checkAuthenticated, team.kickMember)
module.exports = router;
