const e = require('express')
let router = e.Router()
const user = require('../controllers/user.controller')

router.get('/:email', user.getUser);

router.post('/createUser', user.createUser)

router.post('/delete', user.deleteUser);

router.post('/update/:email', user.updateUser);

module.exports = router;
