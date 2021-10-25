const { Team, Team_Member, Subject, User } = require("../database/sequelize")
const { getTeamByName, getTeamById } = require('../utils/getTeam')
const { Op } = require("sequelize");
const { checkTeam, checkMembers } = require('../utils/teamAvailability')

/*********************************************************************
 *  Show teams based on user properties, if user logged in.
 *  Otherwise just show teams.
 * 
 * Send:
 *  name, maxNumOfMem, percentage, joinedUsers
 *  @returns  Teams
 */
module.exports.showTeams = async (req, res) => {

}

/*********************************************************************
 *  Show teams, where i am connected to.
 * 
 */
module.exports.getMyTeams = async (req, res) => {
    if (!req.user) {
        res.status(403).send('You have to be logged in to see your teams.')
    }
    const user = await User.findByPk(req.user.id)

    const teams = await user.getTeams()

    console.log(teams);
    res.status(200).send(teams)
}

/*********************************************************************
 *  Show team informations.
 *  Otherwise just show teams.
 * 
 *  If user is logged in, send flag logged:true.
 * 
 *  TODO: checkAdmin - if user is admin of a team
 * 
 *  @returns  Teams
 */
module.exports.getTeam = async (req, res) => {
    const { id } = req.params;

    const team = await getTeamById(id)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the id ${id}`,
        });
    }

    let logged = false
    if (req.user) {
        logged = true
    }
    let admin = checkAdmin(res.user.id)
    return res.status(200).send([team, { 'logged': logged, 'admin': admin }]);
};

/*********************************************************************
 *  Create new team
 * 
 *  @returns  New team
 */
module.exports.createTeam = async (req, res) => {
    /** Get params and check */
    const { name, briefDescription, maxNumOfMem, hashtags, properties } = req.body;
    const { subject } = req.params
    const userId = req.user.id
    console.log(userId);

    if (!name || !briefDescription || !maxNumOfMem || !properties || !subject) {
        return res.status(400).send('Please provide required fields');
    }

    /** Check team name is not used already */
    const teamExists = await getTeamByName(name, subject)
    if (teamExists) {
        return res.status(400).send({
            message: 'Team with this name already exists',
        });
    }

    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, userId)
    if (team.length) {
        return res.status(401).send('You are already in some other team')
    }
    /** Try to create new team */
    try {
        const newTeam = await Team.create({
            name: name,
            briefDescription: briefDescription,
            properties: properties,
            maxNumberOfMembers: maxNumOfMem,
            hashtags: hashtags,
            TeamAdmin: userId,
            SubjectId: subject
        });
        newTeam.addUser(userId)
        res.status(201).send('Team created')
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}

/*********************************************************************
 *  Connect to the existing team
 * 
 *  @returns  New record in User_Profile table
 */
module.exports.connect = async (req, res) => {
    /** Get params */
    const { teamName, subject } = req.params

    /** Check team already exists */
    const existingTeam = await getTeamByName(teamName, subject)
    if (!existingTeam) {
        return res.status(400).send({
            message: `No team found with name ${teamName}`,
        });
    }

    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, req.user.id)
    if (team.length) {
        return res.status(401).send('You are already in some other team')
    }

    /** Try to connect to a team */
    try {
        existingTeam.addUser(req.user.id)
        res.status(201).send(`Connected to team ${existingTeam.name}`)
    } catch (e) {
        return res.status(400).send(e)
    }
}

/*********************************************************************
 *  Disconnect from a team.
 * 
 *  TODO: User can disconnect in first 24 hours from connecting to the team.
 * 
 */
module.exports.disconnect = async (req, res) => {
    /** Get params */
    const { teamName, subject } = req.params
    const userId = req.user.id

    /** Check team already exists */
    const existingTeam = await getTeamByName(teamName, subject)
    if (!existingTeam) {
        return res.status(400).send({
            message: `No team found with name ${teamName}`,
        });
    }

    /** Check I am a part of a team */
    const userPartOfTeam = await existingTeam.getUsers({
        where: {
            id: userId
        }
    })
    if (!userPartOfTeam) {
        return res.status(401).send('You are not a member of this team.')
    }

    /** Check I am not a admin */
    if (existingTeam.TeamAdmin == req.user.id) {
        return res.status(403).send('You are admin of a team! You can only delete the team.')
    }

    /** Check time for disconnecting */
    const time = await Team_Member.findOne({
        attributes: ['createdAt'],
        where:{
            teamId: teamName,
            userId: userId
        }
    })
    console.log(time);

    /** Disconnect from the team */
    await Team_Member.destroy({
        where: {
            userId: req.user.id,
            teamId: existingTeam.id
        }
    })
    res.status(200).send(`You are now not a member of team ${teamName}`)
}

/*********************************************************************
 *  Delete existing team, if no one other than admin is in.
 * 
 * 
 */
module.exports.deleteTeam = async (req, res) => {
    const user = req.user.id
    const { name, subject } = req.params;
    if (!name) {
        return res.status(400).send({
            message: 'Please provide name for the team you are trying to delete!',
        });
    }

    /** Check team exists */
    const team = await getTeamByName(name, subject)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the name ${name}`,
        });
    }

    /** Is user admin of the team */
    if (user !== team.TeamAdmin) {
        return res.status(401).send('You are not a admin of the team!')
    }

    /** Are there, in the team, some other members */
    const members = await checkMembers(team, user)
    console.log('Members: ', members);
    if (members.length) {
        return res.status(401).send('You can not delete team with users inside')
    }

    try {
        await team.destroy();
        return res.send({
            message: `Team ${name} has been deleted!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};

/*********************************************************************
 *  Kick off member of the team.
 * 
 *  If member is in a team less than 8 hours, admin has the ability
 *  to kick him out.
 * 
 */
module.exports.kickMember = async (req, res) => {
    const { teamName, subject } = req.params
    const { member } = req.body
    const userId = req.user.id

    /** Check team exists */
    const team = await getTeamByName(name, subject)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the name ${name}`,
        });
    }

    /** Is user admin of the team */
    if (userId !== team.TeamAdmin) {
        return res.status(401).send('You are not a admin of the team!')
    }

    /** Member has to be less than 24 hours connected to the team */

}

/*********************************************************************
 *  Update team informations.
 * 
 *  Name, description, number of members, properties, hashtags.
 * 
 */
module.exports.updateTeam = async (req, res) => {
    const { maxNumOfMem, briefDescription, hashtags } = req.body;
    const { name, subject } = req.params;

    const team = await getTeamByName(name, subject)

    if (!team) {
        return res.status(400).send({
            message: `No team found with the name ${name}`,
        });
    }

    try {
        if (name) {
            team.name = name;
        }
        if (maxNumOfMem) {
            team.maxNumberOfMembers = maxNumOfMem;
        }
        if (name) {
            team.briefDescription = briefDescription;
        }
        if (name) {
            team.hashtags = hashtags;
        }

        team.save();
        return res.send({
            message: `Team ${name} has been updated!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
};