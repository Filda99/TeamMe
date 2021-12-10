/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                              Middleware function if user is logged in                                 
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Check if user is logged and has email verified.
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const { User } = require("../database/sequelize");

async function checkAuthenticated(req, res, next) {
  /** Check email verification */
  if (req.user) {
    const user = await User.findByPk(req.user.id)
    if (user.verification != null) {
      return res.status(400).send({
        message: 'Nejprve potvrďte email, který jsme vám zaslali!',
      });
    }
  }else{
    return res.redirect('/login')
  }

  /** Check authentication */
  if (req.isAuthenticated()) {
    console.log('[INFO]: User is logged in!');
    console.log(`ID: `, req.user.id);
    console.log('---------');
    return next()
  }

  return res.redirect('/login')
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