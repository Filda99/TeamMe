const { User } = require("../database/sequelize");

async function checkAuthenticated(req, res, next) {
  /** Check email verification */
  // const user = await User.findByPk(req.user.id)
  // console.log(user.vericifation);
  // if(user.vericifation != null){
  //   return res.redirect('/register')
  // }
  /** Check authentication */
  if (req.isAuthenticated()) {
    console.log('[INFO]: User is logged in!');
    console.log(req.user.id);
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/my_profile')
  }
  next()
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
}