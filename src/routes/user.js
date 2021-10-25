const e = require('express')
let router = e.Router()
const user = require('../controllers/user.controller')

// Show info about user
router.get('/:email', user.getUser);

router.get('/verify-email/:token', user.verificateUser)
// Create user account
router.post('/createUser', user.createUser)

// Delete user account
router.post('/delete', user.deleteUser);

// Update user's info
router.post('/update/:id', user.updateUser);

module.exports = router;
