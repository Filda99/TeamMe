const { Notification } = require("../database/sequelize")

/*********************************************************************
 * Send notification to user
 * 
 * 1)   User leave team
 *  When user join team, admin will receive notification about it.
 *  Add new notification to admin table that user XY joined team.
 * 
 * 2)   User join team
 *  When user join team, admin will receive notification about it.
 *  Add new notification to admin table that user XY joined team.
 * 
 * 3)   User kicked from team
 *  When admin kick user, user will receive notification about it.
 *  Add new notification to user table
 *  that admin XY kicked him from the team.
 */
module.exports.userSendNotifi = async (userId, message) => {
    try{
        await Notification.create({
            'UserId': userId,
            notification: message
        })
        return 1
    }catch(e){
        return e
    }
}

/*********************************************************************
 * Show notification for current user
 * 
 *  When logged, show new notifications.
 */
module.exports.getUserNotifi = async (userId) => {
    try{
        const notifications = await Notification.findAll({
            where: {
                UserId: userId
            }
        })
        return notifications
    }catch(e){
        return e
    }
}

/*********************************************************************
 * Clear notification panel.
 * 
 *  When logged user wants to clear notification panel, delete all
 *  the records.
 */
module.exports.clearUserNotifi = async (userId) => {
    try{
        const deleteNotifi = await Notification.findAll({
            where: {
                UserId: userId
            }
        })
        deleteNotifi.destroy()
        return 1
    }catch(e){
        return e
    }
}