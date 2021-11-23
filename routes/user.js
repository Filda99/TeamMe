const e = require('express')
let router = e.Router()
const user = require('../controllers/user.controller');
const { checkAuthenticated } = require('../utils/isAuthenticated');

// Show info about user
router.get('/:email', user.getUser);

// Verify email
router.get('/verify-email/:token', user.verificateUser)

// Show update form
router.get('/form/update/', checkAuthenticated, user.showUpdate)

// Show reset password form
router.get('/form/resetPass', checkAuthenticated, user.showResetPass)

// Show reset password form - FORGOTTEN PASS
router.get('/form/newPass', user.showNewPass)

// Create user account
router.post('/createUser', user.createUser)

// Delete user account
router.post('/delete', checkAuthenticated, user.deleteUser);

// Update user's info
router.post('/update/:id', checkAuthenticated, user.updateUser);

// Reset pass send email
router.post('/reset-email', user.resetPassEmail)

// Reset users password - FORGOTTEN PASS
router.get('/resetPass/:code', user.resetPass)

router.post('/reset-pass', user.resetPassFinal)
module.exports = router;
