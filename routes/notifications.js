const e = require('express')
let router = e.Router()
const notification = require('../controllers/notification.controller');
const { checkAuthenticated } = require('../utils/isAuthenticated');


// Create new faculty
router.post('/deleteAll', checkAuthenticated, notification.clearUserNotifi)

module.exports = router;
