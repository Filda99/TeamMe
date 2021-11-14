const { Team, Team_Member, User } = require("../database/sequelize")
const { getTeamByName, getAllTeamsToShow, getTeamById } = require('../utils/getTeam')
const { checkTeam, checkMembers, checkAdmin, userPartOfTeam } = require('../utils/teamAvailability');
const { starterCheck } = require('../utils/checkExistingElems')
const { getUserByEmail } = require("../utils/getUser");
const { userSendNotifi, getUserNotifi } = require("./notification.controller");
const { Op } = require("sequelize");

/*********************************************************************
 *  Show teams based on user properties, if user logged in.
 *  Otherwise just show teams.
 * 
 * Send:
 *  name, maxNumOfMem, percentage, joinedUsers
 *  @returns  Teams 
 */
module.exports.showTeams = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    let { subject, faculty } = req.params

    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)

    /** Get all visible teams (not full teams) */
    const teams = await getAllTeamsToShow(subject)

    /** Infos to be send to the world */
    let shareTeamInfo = []

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** USER LOGGED IN */
    if (req.user) {
        /** MACROS FOR THIS CASE */
        const maxPossibleDifference = 8
        const hundredPercent = 100

        /** Get users params and collect them */
        const findUser = await User.findByPk(req.user.id)
        if (!findUser) {
            res.status(401).send({message: 'User not found!'})
        }


        /** Go through all the teams and calculate the percentage */
        for (const team of teams) {
            /** Get joined users to single team */
            const numOfJoinedUsers = await team.getUsers()
            shareTeamInfo.push(numOfJoinedUsers.length)

            /**
             * Calculation goes like this:
             *  1) abs from difference two of same property
             *  2) max difference is 8 (100%/8) -> give us number which we will multiply
             *  3) by opposite number from difference
             *  
             */
            let pWorkingDays = Math.abs(Number(team['workingDays']) - Number(findUser.workingDays))
            let pWorkingHours = Math.abs(Number(team['workingHours']) - Number(findUser.workingHours))
            let pApproach = Math.abs(Number(team['approach']) - Number(findUser.approach))
            const pSum = pWorkingDays + pWorkingHours + pApproach

            /** One-eight of a hundred percent */
            let pPerc = hundredPercent / maxPossibleDifference

            /** 
             * The best case of parameter difference is 0,
             * because of the absolute value of the difference.
             */
            switch (pSum) {
                /** Best case - needs to be 100% */
                case 0:
                    pPerc *= 8
                    break;
                case 1:
                    pPerc *= 7
                    break;
                case 2:
                    pPerc *= 6
                    break;
                case 3:
                    pPerc *= 5
                    break;
                case 4:
                    pPerc *= 4
                    break;
                case 5:
                    pPerc *= 3
                    break;
                case 6:
                    pPerc *= 2
                    break;
                case 7:
                    pPerc *= 1
                    break;
                default:
            }
            /** Get team params, which will be shared /w frontend */
            shareTeamInfo.push(pPerc)
        }
        const logged = true

        let userLogged = false
        let notification = null;
        if (req.user) {
            userLogged = true
            notification = await getUserNotifi(req.user.id)
        }

        res.render('teams', { teams, shareTeamInfo, logged, subject, userLogged, notification })
    }
    /** USER NOT LOGGED IN */
    else {
        /** Cycle through all the teams */
        for (const team of teams) {
            /** Get joined users to single team */
            const numOfJoinedUsers = await team.getUsers()
            /** Get team params, which will be shared /w frontend */
            shareTeamInfo.push(numOfJoinedUsers.length)
        };
        const logged = false

        let userLogged = false
        let notification = null;
        if (req.user) {
            userLogged = true
            notification = await getUserNotifi(req.user.id)
        }

        res.render('teams', { teams, shareTeamInfo, logged, subject, userLogged, notification })
    }
}

/*********************************************************************
 *  Show teams, where i am connected to.
 * 
 */
module.exports.getMyTeams = async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (user) {
        const teams = await user.getTeams()
        res.status(200).send(teams)
    }
    else {
        res.status(404).send({message: 'User not found!'})
    }
}

/*********************************************************************
 *  Show team informations.
 *  If user is logged in, send flag logged:true.
 * 
 *  @returns  Teams
 */
module.exports.getTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    let { subject, faculty, name } = req.params
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!name || !faculty || !subject) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }

    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)



    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    const team = await getTeamByName(name, subject)
    if (!team) {
        return res.status(404).send({
            message: `No team found with the name ${name}`,
        });
    }

    /********************************************* */
    /**********   GET INFOS TO SHARE    ********** */
    /** ADMIN and LOGGED */
    let logged = false
    let isAdmin = false
    let userIsPartOfTeam = false
    try {
        if (req.user) {
            /** Logged */
            logged = true

            /** Admin of the team */
            let admin = await checkAdmin(team.id, req.user.id)
            isAdmin = admin ? true : false

            /** Part of team */
            userIsPartOfTeam = await userPartOfTeam(team, req.user.id)
        }
    } catch (e) {
        return res.status(401).send({message: e})
    }
    /** MEMBERS */
    const teamMembers = await team.getUsers()

    /** TEAM ADMIN */
    const teamAdmin = await User.findByPk(team.TeamAdmin)


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('team', {
        team, teamMembers, teamAdmin, logged,
        isAdmin, faculty, subject, userIsPartOfTeam, userLogged, notification
    })
};

/*********************************************************************
 *  Show create new team form
 * 
 */
module.exports.createTeamForm = async (req, res) => {
    const { subject, faculty } = req.params

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('create_team', { subject, faculty, userLogged, notification })
}

/*********************************************************************
 *  Show update team form
 * 
 */
module.exports.updateTeamForm = async (req, res) => {
    const { subject, faculty, name } = req.params

    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    const team = await getTeamByName(name, subject)
    const teamMembers = await Team_Member.findAll({
        where: {
            teamId: team.id,
            userId: {
                [Op.not]: req.user.id
            }
        }
    })
    const teamMembersLogin = new Array()
    for(member of teamMembers) {
        const user = await User.findByPk(member.userId);
        teamMembersLogin.push(user);
    }
    res.render('team_info_edit', { subject, faculty, team, userLogged, notification, teamMembersLogin })
}

/*********************************************************************
 *  Create new team
 *
 *  @returns  New team
 */
module.exports.createTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { name, briefDescription, maxNumOfMem, hashtags,
        workingHours, workingDays, approach, partOfSemester } = req.body;
    const { subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    if (!name || !briefDescription || !maxNumOfMem || !workingHours
        || !workingDays || !approach || !subject || !faculty || !partOfSemester) {
        console.log(name, briefDescription, maxNumOfMem, workingHours
            , workingDays, approach, subject, faculty, partOfSemester);
        res.status(400).send({message: `Please provide required fields:\n
        name, briefDescription, maxNumOfMem, workingHours, workingDays, approach, subject, faculty, partOfSemester`});
        return
    }

    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)

    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team name is not used already */
    const teamExists = await getTeamByName(name, subject)
    if (teamExists) {
        res.status(409).send({message:'Team with this name already exists'});
        return
    }
    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, userId)
    if (team.length) {
        res.status(403).send({message: "You are already in some other team"});
        return
    }


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Try to create new team */
    try {
        const newTeam = await Team.create({
            name: name,
            briefDescription: briefDescription,
            workingHours: workingHours,
            workingDays: workingDays,
            approach: approach,
            partOfSemester: partOfSemester,
            maxNumberOfMembers: maxNumOfMem,
            hashtags: hashtags,
            TeamAdmin: userId,
            SubjectId: subject
        });
        newTeam.addUser(userId)

        /** Check there is a place in team */
        const numOfJoinedUsers = await Team_Member.findAndCountAll({
            where: {
                teamId: newTeam.id
            }
        })
        if ((numOfJoinedUsers.count + 1) >= newTeam.maxNumberOfMembers) {
            newTeam.visible = 2
            newTeam.save();
        }

        res.status(201).redirect(`/team/${faculty}/${subject}`)
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
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team already exists */
    const existingTeam = await getTeamByName(teamName, subject)
    if (!existingTeam) {
        return res.status(400).send({
            message: `No team found with name ${teamName}`,
        });
    }
    /** Check user is not in other team in current subject */
    const team = await checkTeam(subject, userId)
    if (team.length) {
        return res.status(401).send({message: 'You are already in some other team'})
    }
    /** Check there is a place in team */
    const numOfJoinedUsers = await Team_Member.findAndCountAll({
        where: {
            teamId: existingTeam.id
        }
    })
    if ((numOfJoinedUsers.count) >= existingTeam.maxNumberOfMembers) {
        existingTeam.visible = 2;
        existingTeam.save();
        return res.status(403).send({
            message: "Team capacity is full!"
        })
    }


    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Try to connect to a team */
    try {
        existingTeam.addUser(userId)

        /** Send notification to admin */
        // Get user login
        const getMemberName = await User.findByPk(userId)
        const message = `User ${getMemberName.login} has joined your team ${existingTeam.name}`
        await userSendNotifi(existingTeam.TeamAdmin, message)

        if ((numOfJoinedUsers.count + 1) == existingTeam.maxNumberOfMembers) {
            existingTeam.visible = 2;
            existingTeam.save();
        }

        res.status(201).send({message: `Connected to team ${existingTeam.name}`})
    } catch (e) {
        return res.status(400).send({message: e})
    }
}

/*****
 * Helping function
 * Add specified hourst to the time 
 */
function addHours(date, hours) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

/*********************************************************************
 *  Disconnect from a team.
 * 
 *  User can disconnect in first 24 hours from connecting to the team.
 * 
 */
module.exports.disconnect = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team really exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(404).send({
            message: `No team found with name ${teamName}`,
        });
    }
    /** Check I am a part of a team */
    const userIsPartOfTeam = await userPartOfTeam(team, userId)
    if (!userIsPartOfTeam) {
        return res.status(401).send({message: 'You are not a member of this team.'})
    }
    /** Check I am not a admin */
    if (team.TeamAdmin == userId) {
        return res.status(403).send({message: 'You are admin of a team! You can only delete the team.'})
    }
    /** Check time for disconnecting */
    const time = await Team_Member.findOne({
        attributes: ['createdAt'],
        where: {
            teamId: team.id,
            userId: userId
        }
    })
    let timeToLeave = time.createdAt
    let timeNow = new Date()
    const newDate = addHours(timeNow, 24);
    if (timeToLeave > newDate) {
        return res.status(406).send({message: 'You cant leave this team! It has been more than 24 hours since you joined.'})
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    /** Disconnect from the team */
    await Team_Member.destroy({
        where: {
            userId: userId,
            teamId: team.id
        }
    })

    /** Send notification to admin */
    // Get user login
    const getMemberName = await User.findByPk(userId)
    const message = `User ${getMemberName.login} has left your team ${teamName}`

    /** Set team visible to 1 */
    team.visible = 1
    team.save()
    await userSendNotifi(team.TeamAdmin, message)

    res.status(200).send({message: `You are now not a member of team ${teamName}`})
}

/*********************************************************************
 *  Delete existing team, if no one other than admin is in.
 * 
 * 
 */
module.exports.deleteTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const userId = req.user.id
    const { teamName, subject, faculty } = req.params;
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !faculty) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the name ${teamName}`,
        });
    }
    /** Is user admin of the team */
    if (userId !== team.TeamAdmin) {
        return res.status(401).send({message: 'You are not a admin of the team!'})
    }
    /** Are there, in the team, some other members */
    const members = await checkMembers(team, userId)
    console.log('Members: ', members);
    if (members.length) {
        return res.status(401).send({message: 'You can not delete team with users inside'})
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        await team.destroy();
        return res.status(200).send({
            message: `Team ${teamName} has been deleted!`,
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
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, subject, faculty } = req.params
    const { memberEmail } = req.body
    const userId = req.user.id
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamName || !subject || !memberEmail || !faculty) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    /** Check team exists */
    const team = await getTeamByName(teamName, subject)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the name ${name}`,
        });
    }
    /** Is user admin of the team */
    if (userId !== team.TeamAdmin) {
        return res.status(401).send({message: 'You are not a admin of the team!'})
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        const member = await getUserByEmail(memberEmail)
        if (!member) {
            return res.status(401).send({message: 'Something went wrong.'})
        }

        /** Member has to be less than 24 hours connected to the team */
        const time = await Team_Member.findOne({
            attributes: ['createdAt'],
            where: {
                teamId: team.id,
                userId: member.id
            }
        })
        let timeToLeave = time.createdAt
        let timeNow = new Date()
        const newDate = addHours(timeNow, 24);
        if (timeToLeave > newDate) {
            return res.status(403).send({message: 'You cant leave this team! It has been more than 24 hours since you joined.'})
        }

        /** Disconnect from the team */
        await Team_Member.destroy({
            where: {
                userId: member.id,
                teamId: team.id
            }
        })
        res.status(200).send({message: `You kicked user ${memberEmail} from team ${teamName}`})

        /** Send notification to admin */
        // Get user login
        const getMemberName = await User.findByPk(userId)
        const message = `User ${getMemberName.login} kicked you from team ${teamName}`

        /** Set team visible to 1 */
        team.visible = 1
        team.save()
        await userSendNotifi(member.id, message)

    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}

/*********************************************************************
 *  Update team informations.
 * 
 *  Name, description, number of members, properties, hashtags.
 * 
 */
module.exports.updateTeam = async (req, res) => {
    /********************************************* */
    /***********      GET PARAMS       *********** */
    const { teamName, maxNumOfMem, briefDescription, hashtags, workingHours, workingDays, approach,
        partOfSemester } = req.body;
    const { teamId, subject, faculty } = req.params;
    /********************************************* */
    /**********      CHECK PARAMS       ********** */
    /** Check params not null */
    if (!teamId || !subject || !faculty) {
        return res.status(400).send({
            message: 'Please provide required params!',
        });
    }
    /** Check that faculty and subject exists */
    await starterCheck(req, res, faculty, subject)


    /********************************************* */
    /**********    CHECK CONDITIONS     ********** */
    const team = await getTeamById(teamId, subject)
    if (!team) {
        return res.status(400).send({
            message: `No team found with the id ${teamId}`,
        });
    }

    /********************************************* */
    /**********    MAIN JOB OF FUNC     ********** */
    try {
        if (teamName) {
            team.teamName = teamName;
        }
        if (maxNumOfMem) {
            team.maxNumberOfMembers = maxNumOfMem;
        }
        if (briefDescription) {
            team.briefDescription = briefDescription;
        }
        if (hashtags) {
            team.hashtags = hashtags;
        }
        if (workingHours) {
          team.workingHours = workingHours;
        }
        if (workingDays) {
          team.workingDays = workingDays;
        }
        if (approach) {
          team.approach = approach
        }
        if(partOfSemester){
            team.partOfSemester = partOfSemester
        }
        team.save();
        return res.status(200).send({
            message: `Team ${team.name} has been updated!`,
        });
    } catch (err) {
        return res.status(500).send({
            message: `Error: ${err.message}`,
        });
    }
}