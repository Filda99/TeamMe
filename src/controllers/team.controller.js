const { Team } = require("../database/sequelize")
const { getTeamByName, getTeamById } = require('../utils/getTeam')

/*********************************************************************
 *  Show teams based on user properties, if user logged in.
 *  Otherwise just show teams.
 * 
 *  @returns  Teams
 */
module.exports.showTeams = async (req, res) => {

}

/*********************************************************************
 *  Show team informations.
 *  Otherwise just show teams.
 * 
 *  If user is logged in, send flag logged:true.
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

    let flag = false
    if (req.user) {
        flag = true
    }
    return res.status(200).send([team, { 'flag': flag }]);
};

/*********************************************************************
 *  Create new team
 * 
 *  @returns  New team
 */
module.exports.createTeam = async (req, res) => {
    const { name, briefDescription, maxNumOfMem, hashtags, properties } = req.body;
    if (!name || !briefDescription || !maxNumOfMem || !properties) {
        return res.status(400).send({
            message: 'Please provide required fields',
        });
    }

    const teamExists = await getTeamByName(name)
    if (teamExists) {
        return res.status(400).send({
            message: 'Team with this name already exists',
        });
    }

    try {
        const newTeam = await Team.create({
            name: name,
            briefDescription: briefDescription,
            properties: properties,
            maxNumberOfMembers: maxNumOfMem,
            hashtags: hashtags,
            'TeamAdmin': req.user.id
        });

        newTeam.addUser(req.user.id)
        res.status(201).send('Team created')

    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}

/*********************************************************************
 *  Connect to the existing team
 *  TODO: Is user connected to the other team in this subject?
 * 
 *  @returns  New record in User_Profile table
 */
module.exports.connect = async (req, res) => {
    const { teamID } = req.params

    const existingTeam = await getTeamById(teamID)
    if (!existingTeam) {
        return res.status(400).send({
            message: `No team found with the id ${id}`,
        });
    }

    try {
        existingTeam.addUser(req.user.id)
        res.status(201).send('Connected to team ', existingTeam.name)
    }catch(e){
        return res.status(400).send(e)
    }
}

// module.exports.deleteTeam = async (req, res) => {
//     const { email } = req.body;
//     if (!email) {
//         return res.status(400).send({
//             message: 'Please provide an email for the user you are trying to delete!',
//         });
//     }

//     const user = await User.findOne({
//         where: {
//             email,
//         },
//     });

//     if (!user) {
//         return res.status(400).send({
//             message: `No user found with the email ${email}`,
//         });
//     }

//     try {
//         await user.destroy();
//         return res.send({
//             message: `User ${email} has been deleted!`,
//         });
//     } catch (err) {
//         return res.status(500).send({
//             message: `Error: ${err.message}`,
//         });
//     }
// };

// module.exports.updateTeam = async (req, res) => {
//     const { password } = req.body;
//     const { email } = req.params;

//     const user = await User.findOne({
//         where: {
//             email,
//         },
//     });

//     if (!user) {
//         return res.status(400).send({
//             message: `No user found with the id ${id}`,
//         });
//     }

//     try {
//         if (password) {
//             user.password = password;
//         }

//         user.save();
//         return res.send({
//             message: `User ${email} has been updated!`,
//         });
//     } catch (err) {
//         return res.status(500).send({
//             message: `Error: ${err.message}`,
//         });
//     }
// };