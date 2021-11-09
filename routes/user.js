const e = require('express')
let router = e.Router()
const user = require('../controllers/user.controller');
const { checkAuthenticated } = require('../utils/isAuthenticated');

// Show info about user
router.get('/:email', user.getUser);

// Verify email
router.get('/verify-email/:token', user.verificateUser)

// Show update form
router.get('/update/')

// Show reset password form
router.get('/resetPassword')

router.post('/resetPassword/:id')

// Create user account
router.post('/createUser', user.createUser)

// Delete user account
router.post('/delete', checkAuthenticated, user.deleteUser);

// Update user's info
router.post('/update/:id', checkAuthenticated, user.updateUser);

module.exports = router;
