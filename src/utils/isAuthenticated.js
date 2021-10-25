function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      console.log('[INFO]: User is logged in!');
      console.log(req.user.id);
      return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/my_profile')
  }
  next()
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
}