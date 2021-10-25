const e = require('express')
let router = e.Router()
const subject = require('../controllers/subject.controller')

// Show all faculties
router.get('/', subject.getAll);

// Create new faculty
router.post('/:faculty/createSubject', subject.createNew)

module.exports = router;
