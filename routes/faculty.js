const e = require('express')
let router = e.Router()
const faculty = require('../controllers/faculty.controller')

// Show all faculties
router.get('/', faculty.getAll);

// Create new faculty
router.post('/createFaculty', faculty.createNew)

module.exports = router;
