const { User, Team, Team_Member } = require("../database/sequelize")
const { Op } = require("sequelize");

/**
 * Check user is part of any team 
 */
async function userPartOfAnyTeam(userId){
    return await Team_Member.findOne({
        where: {
            userId: userId
        }
    })
}

/**
 * Check user is part of the team
 */
async function userPartOfTeam (team, userId){
    const user = await team.getUsers({
        where: {
            id: userId
        }
    })
    return user.length ? true : false;
}

/**
 * Check if person is in another team in current subject
 * 
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
    console.log(team);
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

/** 
 * Check if user is a admin of a team
 */
async function checkAdmin(teamId, user) {
    const isAdmin = await Team.findOne({
        where: {
            TeamAdmin: user,
            id: teamId
        }
    })
    return isAdmin
}

module.exports = {
    checkTeam,
    checkMembers,
    checkAdmin,
    userPartOfTeam,
    userPartOfAnyTeam
}