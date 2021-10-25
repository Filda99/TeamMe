const { Team, User } = require("../database/sequelize")
const { Op } = require("sequelize");

/**
 * Check if person is in another team in current subject
 * 
 * @param {Subject} subject 
 * @param {User} userId 
 * @returns If person is in some other team in subject - team.
 *          Otherwise returns null.
 */
async function checkTeam(subject, userId) {
    const user = await User.findByPk(userId)

    const team = await user.getTeams({
        where: {
            SubjectId: subject
        }
    })
    return team
}

/**
 * Check if is in a team someone else
 */
async function checkMembers(team, userId) {
    const members = await team.getUsers({
        where: {
            id: {
                [Op.ne]: userId
            }
        }
    })
    return members
}

module.exports = {
    checkTeam,
    checkMembers
}